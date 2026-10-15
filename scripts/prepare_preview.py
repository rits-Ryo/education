"""Prepare an allowlisted snapshot and optionally serve only that snapshot."""
import argparse
import functools
import hashlib
import http.server
import os
import math
from pathlib import Path, PurePosixPath
import stat
import subprocess
import tempfile
import threading
import urllib.error
import urllib.request

ROOT = Path(__file__).resolve().parents[1]
EXTENSIONS = {".html", ".css", ".js", ".png", ".jpg", ".jpeg", ".gif",
              ".svg", ".webp", ".ico", ".woff", ".woff2", ".ttf", ".otf"}
BLOCKED = {".local", ".git", ".github", "scripts", "node_modules", ".vscode",
           ".aws", ".codex", ".agents", "credentials", "secrets", "__pycache__"}


def git(*args):
    result = subprocess.run(["git", *args], cwd=ROOT, capture_output=True)
    if result.returncode:
        raise RuntimeError("Git検証失敗: " + result.stderr.decode("utf-8", "replace"))
    return result.stdout


def inspect_path(path):
    """Inspect parents first with lstat; missing metadata fails closed."""
    path = Path(os.path.abspath(path))
    components = [*reversed(path.parents), path]
    information = None
    for index, component in enumerate(components):
        information = os.lstat(component)
        if stat.S_ISLNK(information.st_mode):
            raise ValueError("シンボリックリンクは許可しません: " + str(component))
        if os.name == "nt":
            attributes = information.st_file_attributes
            if attributes & stat.FILE_ATTRIBUTE_REPARSE_POINT:
                raise ValueError("リパースポイントは許可しません: " + str(component))
        if index < len(components) - 1 and not stat.S_ISDIR(information.st_mode):
            raise ValueError("親パスがディレクトリではありません: " + str(component))
    return information


def make_directories(path):
    """Check each parent before creating its child; recheck created paths."""
    path = Path(os.path.abspath(path))
    for component in [*reversed(path.parents), path]:
        try:
            information = inspect_path(component)
        except FileNotFoundError:
            inspect_path(component.parent)
            component.mkdir()
            information = inspect_path(component)
        if not stat.S_ISDIR(information.st_mode):
            raise ValueError("保存先がディレクトリではありません: " + str(component))


def safe_file(relative):
    path = PurePosixPath(relative)
    if path.is_absolute() or ".." in path.parts or "\\" in relative or ":" in relative:
        raise ValueError("相対パス以外は許可しません: " + relative)
    if any(part.startswith(".") or part.lower() in BLOCKED for part in path.parts):
        return False
    if path.suffix.lower() not in EXTENSIONS:
        return False
    if path.name.lower() in {"tests.js", "ui-tests.js", "config.js", "credentials.js", "secrets.js"}:
        return False
    source = ROOT.joinpath(*path.parts)
    information = inspect_path(source)
    if not source.is_relative_to(ROOT) or not stat.S_ISREG(information.st_mode):
        raise ValueError("範囲外または存在しないファイル: " + relative)
    return True


def digest(data):
    return hashlib.sha256(data).hexdigest()


def prepare(extras):
    inspect_path(ROOT)
    if git("ls-files", "-z", "--", ".local"):
        raise ValueError(".local内に追跡ファイルがあります")
    git("check-ignore", "--", ".local/environment/preview-check")
    tracked = git("ls-files", "-z").decode("utf-8").split("\0")
    selected = {name for name in tracked if name and safe_file(name)}
    for name in extras:
        if not safe_file(name):
            raise ValueError("追加ファイルが許可対象ではありません: " + name)
        selected.add(name)
    local = ROOT / ".local" / "environment"
    make_directories(local)
    snapshot = Path(tempfile.mkdtemp(prefix="preview-", dir=local))
    inspect_path(snapshot)
    manifest = {}
    for name in sorted(selected):
        source = ROOT / name
        destination = snapshot / name
        safe_file(name)
        make_directories(destination.parent)
        data = source.read_bytes()
        inspect_path(destination.parent)
        # Never overwrite a file or link introduced at the destination.
        with destination.open("xb") as output:
            output.write(data)
        inspect_path(destination)
        inspect_path(source)
        if data != destination.read_bytes() or data != source.read_bytes():
            raise RuntimeError("コピー中に内容が変化しました: " + name)
        manifest["/" + name] = digest(data)
    print("スナップショット:", snapshot.relative_to(ROOT))
    print("許可ファイル数:", len(manifest), "全ファイル内容一致。既存ファイルの削除なし。")
    return snapshot, manifest


class Handler(http.server.SimpleHTTPRequestHandler):
    """Serve only known snapshot files; no listing, traversal, or hidden files."""
    manifest = {}

    def send_head(self):
        from urllib.parse import unquote, urlsplit
        requested = unquote(urlsplit(self.path).path)
        if any(part in {".", ".."} or part.startswith(".") for part in requested.split("/") if part):
            self.send_error(404)
            return None
        if requested.endswith("/"):
            requested += "index.html"
        if requested not in self.manifest:
            self.send_error(404)
            return None
        target = Path(self.directory) / requested.lstrip("/")
        root = Path(os.path.abspath(self.directory))
        try:
            information = inspect_path(target)
        except (OSError, ValueError, AttributeError):
            self.send_error(404)
            return None
        if not target.is_relative_to(root) or not stat.S_ISREG(information.st_mode) or digest(target.read_bytes()) != self.manifest[requested]:
            self.send_error(404)
            return None
        return super().send_head()


def positive_seconds(value):
    seconds = float(value)
    if not math.isfinite(seconds) or seconds <= 0 or seconds > threading.TIMEOUT_MAX:
        raise argparse.ArgumentTypeError("最大稼働時間は有限の正の秒数で指定してください")
    return seconds


def serve(snapshot, manifest, port, max_seconds=1800):
    inspect_path(snapshot)
    Handler.manifest = manifest
    handler = functools.partial(Handler, directory=str(snapshot))
    server = http.server.ThreadingHTTPServer(("127.0.0.1", port), handler)
    worker = threading.Thread(target=server.serve_forever, daemon=True)
    stopped = threading.Event()
    cleanup_lock = threading.Lock()
    expired = threading.Event()
    started = False

    def cleanup():
        # Timer and main thread share ownership of this server only.
        with cleanup_lock:
            if stopped.is_set():
                return
            try:
                if started:
                    server.shutdown()
            finally:
                server.server_close()
                stopped.set()

    def expire():
        expired.set()
        cleanup()

    timer = threading.Timer(max_seconds, expire)
    timer.daemon = True
    opener = urllib.request.build_opener(urllib.request.ProxyHandler({}))
    try:
        worker.start()
        started = True
        timer.start()
        for name in ["/index.html", "/subjects/math/index.html"]:
            with opener.open(f"http://127.0.0.1:{port}{name}", timeout=5) as response:
                if response.status != 200 or digest(response.read()) != manifest[name]:
                    raise RuntimeError("HTTP内容一致の検証失敗: " + name)
        for name in ["/.local/", "/.git/config", "/AGENTS.md", "/scripts/verify.py", "/%2e%2e/AGENTS.md"]:
            try:
                opener.open(f"http://127.0.0.1:{port}{name}", timeout=5).close()
                raise RuntimeError("非公開パスへの応答を検出: " + name)
            except urllib.error.HTTPError as error:
                if error.code != 404:
                    raise
        print(f"HTTP検証成功。PID={os.getpid()} http://127.0.0.1:{port}/ 最大稼働時間={max_seconds}秒。Ctrl+Cで終了。", flush=True)
        stopped.wait()
        if expired.is_set():
            print("最大稼働時間に達したため停止しました。")
    except KeyboardInterrupt:
        print("Ctrl+Cを受信。サーバーを停止します。スナップショットは保持します。")
    finally:
        timer.cancel()
        cleanup()
        if timer.ident is not None:
            timer.join()
        if started:
            worker.join(timeout=5)
        if worker.is_alive() or server.socket.fileno() != -1:
            raise RuntimeError("サーバーの停止を確認できません。表示したPIDを確認してください。")
        print("停止確認済み：配信スレッド終了・自分の待ち受けソケット閉鎖。", flush=True)


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--include", action="append", default=[], metavar="RELATIVE_FILE",
                        help="個別に公開内容を確認した未追跡ファイル（ディレクトリ不可）")
    parser.add_argument("--serve", action="store_true")
    parser.add_argument("--port", type=int, default=8000)
    parser.add_argument("--max-seconds", type=positive_seconds, default=1800,
                        help="最大稼働時間（秒、既定1800）。通常の後片付けの予備措置")
    args = parser.parse_args()
    try:
        snapshot, manifest = prepare(args.include)
        if args.serve:
            serve(snapshot, manifest, args.port, args.max_seconds)
        return 0
    except (OSError, ValueError, AttributeError, RuntimeError, subprocess.SubprocessError) as error:
        print("準備・起動失敗:", error)
        print("既存プロセスは停止していません。静的準備は--serveなしで実行できます。")
        return 1


if __name__ == "__main__":
    raise SystemExit(main())
