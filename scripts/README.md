# 共通の開発環境と検証

Start skillの自動適用に依存せず、Git管理するAGENTS.mdとPython標準ライブラリのスクリプトを使用します。Python 3.10以上、Git、Node.jsを用意してください。追加パッケージやビルド工程は不要です。教材のファイル構成は変更しません。

## 作業開始とテスト

最初にAGENTS.mdを読み、リポジトリ直下で実行します。

Windows PowerShell:

```powershell
python scripts/verify.py
$LASTEXITCODE
```

Linux・Codex Cloud:

```sh
python3 scripts/verify.py
echo $?
```

現在のブランチ、作業ツリー、HEAD、GitHub最新mainのSHAを表示します。一致・不一致・未確認を区別し、fetch・checkout・resetなどGitの状態を変更する操作はしません。SHA不一致なら報告し、勝手に同期しないでください。PCがmain以外なら切り替えず作業を停止します。Cloudの管理ブランチは尊重してください。

ネットワーク確認は20秒で打ち切り、未確認でもテストは継続します。古いorigin/mainを最新の証拠にしません。利用可能ならCodexがGitHub連携の読み取りでmainの最新SHAを別途確認し、確認手段を報告します。スクリプト内にトークンを保存しません。

必須のNode.jsテスト42種類（従来22種類・化学20教材）を最後まで実行します。終了コード、成功・失敗・未実行、明示されたPASS行・FAIL行の件数、診断を表示します。失敗件数の未報告を「失敗0件の証明」とみなさないでください。必須テストの失敗・ファイル欠落・Node未導入・タイムアウトは全体の終了コード1になります。全テスト成功時は0です。GitHubの同期未確認とテスト結果は別項目です。

個別テスト（両OS共通）:

```sh
node scripts/math-display-tests.js
node subjects/chemistry/atomic_structure/tests.js
node subjects/chemistry/periodic_trends/tests.js
node subjects/chemistry/bonding_molecular_geometry/tests.js
node subjects/chemistry/mole_stoichiometry/tests.js
node subjects/chemistry/solution_concentration/tests.js
node subjects/chemistry/gas_laws/tests.js
node subjects/chemistry/phase_diagram/tests.js
node subjects/chemistry/thermochemistry/tests.js
node subjects/chemistry/reaction_kinetics/tests.js
node subjects/chemistry/chemical_equilibrium/tests.js
node subjects/chemistry/le_chatelier/tests.js
node subjects/chemistry/acid_base_ph/tests.js
node subjects/chemistry/acid_base_titration/tests.js
node subjects/chemistry/buffer_solution/tests.js
node subjects/chemistry/solubility_product/tests.js
node subjects/chemistry/oxidation_reduction/tests.js
node subjects/chemistry/galvanic_cell/tests.js
node subjects/chemistry/electrolysis_faraday/tests.js
node subjects/chemistry/crystal_lattices/tests.js
node subjects/chemistry/organic_isomerism/tests.js
node subjects/math/quadratic_inequalities/tests.js
node subjects/math/triangle_theorems/tests.js
node subjects/math/probability_simulation/tests.js
node subjects/math/sequences_recursion/tests.js
node subjects/math/binomial_distribution/tests.js
node subjects/math/exponential_logarithmic/tests.js
node subjects/math/circle_and_line/tests.js
node subjects/math/complex_plane/tests.js
node subjects/math/spatial_vectors/tests.js
node subjects/math/limits_and_continuity/tests.js
node subjects/physics/kinematics/tests.js
node subjects/physics/wave_interference/tests.js
node subjects/physics/electric_field_potential/tests.js
node scripts/number-format-tests.js
node subjects/math/Quadratic_function/tests.js
node subjects/math/trigonometric_functions/tests.js
node subjects/math/differentiation/tests.js
node subjects/math/integration/tests.js
node subjects/math/integration/ui-tests.js
node subjects/math/vectors_inner_product/tests.js
node subjects/math/vectors_inner_product/ui-tests.js
```

ログを保存する場合は.local内だけに保存します。

## 安全なプレビュー

リポジトリのルートでHTTPサーバーを起動せず、スナップショットを使用します。

Windows PowerShell:

```powershell
python scripts/prepare_preview.py
python scripts/prepare_preview.py --serve
```

Linux・Codex Cloud:

```sh
python3 scripts/prepare_preview.py
python3 scripts/prepare_preview.py --serve
```

最初のコマンドは静的準備のみです。毎回.local/environment/preview-*に新しいスナップショットを作り、既存の一時ファイルは削除しません。.localのGit除外と未追跡状態を事前に確認します。

Python 3.10以上で使える`os.lstat()`と`stat`の属性を使用し、パスの親から順に検査します。Windowsでは`st_file_attributes`の`FILE_ATTRIBUTE_REPARSE_POINT`を確認し、ジャンクション・シンボリックリンクを含むすべてのリパースポイントを拒否します。Linuxでもシンボリックリンクを拒否します。属性の取得失敗を安全とはみなしません。コピー元・親ディレクトリ・.local・保存先・HTTP配信対象と、--includeのファイルに同じ検査を適用します。`Path.is_junction()`には依存しません。検査と入出力の間に別プロセスがパスを差し替える状況を完全に防ぐ仕組みではないため、作業中のフォルダーを第三者に変更させないでください。

Git管理対象の現在の作業ファイルからHTML・CSS・JavaScript・画像・フォントをコピーします。未コミットの編集も反映します。隠しパス、環境設定用フォルダー、テスト、設定・認証情報用のファイルは対象外です。シンボリックリンク・Windowsジャンクションとその配下、外部パスは拒否します。全コピーの内容一致を確認します。ただし拡張子の許可は秘密情報の自動検出ではありません。許可ファイルの内容も公開前に確認してください。

--serveは127.0.0.1:8000だけにバインドします。主要HTMLのHTTP 200と内容一致、.local・.git・AGENTS.md・scriptsなどの404を自動検証します。ディレクトリ一覧は配信せず、コピー時の許可一覧と内容ハッシュが一致するファイルだけを返します。変更をプレビューに反映するには停止後に再実行します。

終了は起動した端末でCtrl+Cを押します。このPythonサーバーだけを終了し、スナップショットは保持します。ポート使用中なら既存プロセスを停止せず、明示的に別ポートを選んでください。

AIは必要な場合だけ起動し、確認完了・例外・テスト失敗・中断時に可能な範囲で停止します。最終報告前に起動したプロセスの終了を確認します。既定の最大稼働時間は1800秒（30分）で、自動停止は後片付けを忘れた場合の予備措置です。`--max-seconds 60`で60秒など、有限の正の秒数を指定できます。Windowsでは`python scripts/prepare_preview.py --serve --max-seconds 60`、Linuxでは`python3 scripts/prepare_preview.py --serve --max-seconds 60`です。

起動時のPIDを記録してください。終了時は自分の配信スレッドと待ち受けソケットの閉鎖を検査します。停止確認できない場合は、その旨と原因を報告してください。Windowsの`Get-Process -Id <記録したPID>`、Linuxの`ps -p <記録したPID>`でプロセスを確認できます。Windowsでは`Get-NetTCPConnection -State Listen -LocalPort 8000`、Linuxでは利用可能なら`ss -ltnp`で待ち受けと所有PIDを確認できます。ポート番号だけでプロセスを終了せず、記録したPIDと起動コマンドが一致する自分のサーバーだけを対象にしてください。PIDは再利用されるため、古いPIDだけを根拠に停止しないでください。強制終了やOS停止時は後片付けを保証できません。

```powershell
python scripts/prepare_preview.py --serve --port 8001
```

```sh
python3 scripts/prepare_preview.py --serve --port 8001
```

新規教材の未追跡ファイルは内容を個別に確認してから、ファイルごとに--includeを指定できます。ディレクトリの一括追加・ワイルドカード指定はできません。

```powershell
python scripts/prepare_preview.py --include subjects/math/new_lesson/index.html --include subjects/math/new_lesson/script.js --serve
```

```sh
python3 scripts/prepare_preview.py --include subjects/math/new_lesson/index.html --include subjects/math/new_lesson/script.js --serve
```

## 新規教材・ブラウザの確認

新しい必須テストはverify.pyのTESTSに明示的に追加します。新規教材の必要ファイルを個別にスナップショットへ追加し、カタログ登録と以下の操作を確認してください。

- 教科・教材の登録数とカード表示数の一致。
- エントランス→教科→教材→教科のリンク。
- HTML・CSS・JavaScriptの読み込み失敗、ブラウザコンソールのエラー。
- 二次関数の計算、最大・最小の点、グラフ、スライダー。
- 完全順列でn=5のD5=44と列挙44個。
- 各教材のグラフ・ドラッグ・入力・再生、PC・iPad・狭い画面の表示。
- 物理：運動の3グラフ・符号付き面積、波のPと時間波形、電荷・P操作と力線・等電位線・未定義表示。

物理3教材のtests.jsは各ui-tests.jsも実行し、共通のscripts/physics-ui-harness.jsで実際の描画・制御コードを検証します。

既存のPlaywrightが利用できる環境では、上記HTTP URLを対象に検証できます。この整備でPlaywrightやChromiumは新規インストールしません。UIシミュレーションテストは実ブラウザ・タッチ操作の代替ではありません。数式テストは固定版KaTeXで静的LaTeXの構文、ローカルフォント参照、安全設定、エラー代替、動的更新の再利用を検証します。UIテストでも生成されたLaTeXを実際のKaTeXで解析します。

HTTPサーバーの起動が制限されるCloud環境では、--serveなしで静的準備を実行します。Chromiumが起動できない場合もNodeテストは継続し、ブラウザ検証は未実施として原因とPCで確認する項目を報告します。Windows・Linux向けの実装であっても、実行していないOSを検証済みと報告しないでください。

コミット・Push・PR・マージは明示的な承認後だけ実行します。mainへのPushはPages公開につながるため、変更内容・テスト結果・機密情報混入・未完成機能を事前に確認してください。

## Cloudの新規タスクに使うプロンプト

> AGENTS.mdを読み、Start skillに依存せずscripts/verify.pyで開始時のGit状態と必須テストを確認してください。GitHub最新mainとのSHA一致を確認し、接続失敗時は利用可能なGitHub連携の読み取りを試してください。不一致・未確認を報告し、勝手に同期やブランチ切り替えをしないでください。プレビューはscripts/prepare_preview.pyを使用してください。ブラウザを利用できなくてもNodeテストは継続し、未検証項目を明示してください。既存変更を保護し、承認なくコミット・Push・PR・マージしないでください。
