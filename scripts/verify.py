"""Read-only Git checks and all required Node.js tests; standard library only."""
import re
import shutil
import subprocess
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
TESTS = [
    "scripts/math-display-tests.js",
    "subjects/physics/kinematics/tests.js",
    "subjects/physics/wave_interference/tests.js",
    "subjects/physics/electric_field_potential/tests.js",
    "scripts/number-format-tests.js",
    "subjects/math/Quadratic_function/tests.js",
    "subjects/math/trigonometric_functions/tests.js",
    "subjects/math/differentiation/tests.js",
    "subjects/math/integration/tests.js",
    "subjects/math/integration/ui-tests.js",
    "subjects/math/vectors_inner_product/tests.js",
    "subjects/math/vectors_inner_product/ui-tests.js",
    "subjects/math/quadratic_inequalities/tests.js",
    "subjects/math/triangle_theorems/tests.js",
    "subjects/math/probability_simulation/tests.js",
    "subjects/math/sequences_recursion/tests.js",
    "subjects/math/binomial_distribution/tests.js",
    "subjects/math/exponential_logarithmic/tests.js",
    "subjects/math/circle_and_line/tests.js",
    "subjects/math/complex_plane/tests.js",
    "subjects/math/spatial_vectors/tests.js",
    "subjects/math/limits_and_continuity/tests.js",
    "subjects/chemistry/atomic_structure/tests.js",
    "subjects/chemistry/periodic_trends/tests.js",
    "subjects/chemistry/bonding_molecular_geometry/tests.js",
    "subjects/chemistry/mole_stoichiometry/tests.js",
    "subjects/chemistry/solution_concentration/tests.js",
    "subjects/chemistry/gas_laws/tests.js",
    "subjects/chemistry/phase_diagram/tests.js",
    "subjects/chemistry/thermochemistry/tests.js",
    "subjects/chemistry/reaction_kinetics/tests.js",
    "subjects/chemistry/chemical_equilibrium/tests.js",
    "subjects/chemistry/le_chatelier/tests.js",
    "subjects/chemistry/acid_base_ph/tests.js",
    "subjects/chemistry/acid_base_titration/tests.js",
    "subjects/chemistry/buffer_solution/tests.js",
    "subjects/chemistry/solubility_product/tests.js",
    "subjects/chemistry/oxidation_reduction/tests.js",
    "subjects/chemistry/galvanic_cell/tests.js",
    "subjects/chemistry/electrolysis_faraday/tests.js",
    "subjects/chemistry/crystal_lattices/tests.js",
    "subjects/chemistry/organic_isomerism/tests.js",

]


def run(args, timeout=60):
    try:
        result = subprocess.run(args, cwd=ROOT, capture_output=True,
                                encoding="utf-8", errors="replace", timeout=timeout)
        return result.returncode, result.stdout, result.stderr
    except subprocess.TimeoutExpired as error:
        output = error.stdout or b""
        if isinstance(output, bytes):
            output = output.decode("utf-8", "replace")
        return 124, output, f"タイムアウト（{timeout}秒）"
    except OSError as error:
        return None, "", str(error)


def main():
    for command in [["branch", "--show-current"], ["status", "--short"]]:
        code, out, err = run(["git", *command])
        print("git " + " ".join(command), "exit=", code)
        print(out or err or "(clean)")
    head_code, head, head_error = run(["git", "rev-parse", "HEAD"])
    remote_code, remote, remote_error = run(
        ["git", "ls-remote", "origin", "refs/heads/main"], timeout=20)
    sha = remote.split()[0] if remote_code == 0 and remote.strip() else None
    print("HEAD:", head.strip() if head_code == 0 else head_error)
    print("GitHub main:", sha or "未確認")
    if head_code == 0 and sha:
        print("SHA比較:", "一致" if head.strip() == sha else "不一致（自動同期しません）")
    else:
        print("SHA比較: 未確認。キャッシュは使用しません。")
        print(remote_error or "リモートmainを取得できませんでした。")

    results = []
    node = shutil.which("node")
    for filename in TESTS:
        reason = ""
        if not (ROOT / filename).is_file():
            code, output, reason = None, "", "テストファイルがありません"
        elif not node:
            code, output, reason = None, "", "Node.jsがありません"
        else:
            code, output, reason = run([node, filename])
        status = "未実行" if code is None else "成功" if code == 0 else "失敗"
        # Count only explicit PASS/FAIL records, not inferred totals from exit codes.
        passed = len(re.findall(r"^PASS(?:\s|$)", output, re.MULTILINE))
        failed = len(re.findall(r"^FAIL(?:\s|$)", output, re.MULTILINE))
        print(f"\n{filename}: {status}, exit={code}, PASS出力={passed}, FAIL出力={failed}")
        summaries = re.findall(r"^\d+[^\n]*(?:passed|failed)[^\n]*$", output, re.MULTILINE)
        print("テスト自身の件数報告:", "; ".join(summaries) or "未報告")
        print(output)
        if reason:
            print("理由・診断:", reason)
        results.append(status)
    print("集計:", {label: results.count(label) for label in ["成功", "失敗", "未実行"]})
    print("件数は明示されたPASS/FAIL行のみ。未報告の失敗件数は推測しません。")
    return 0 if all(status == "成功" for status in results) else 1


if __name__ == "__main__":
    raise SystemExit(main())
