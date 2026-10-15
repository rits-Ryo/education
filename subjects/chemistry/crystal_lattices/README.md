# 結晶構造・単位格子

化学 · 固体構造。`index.html`を化学カタログから開きます。格子・半径を選び、図のドラッグまたは方位・仰角で回転します。

## モデル・仮定・例外

角原子の寄与1/8、面心1/2、体心1から原子数は1/2/4。配位数は6/8/12です。最隣接原子が接する球模型で半径と格子定数を関係付けます。充填率は球模型の概算で約52.4%、68.0%、74.0%。球は電子雲の実測形状ではありません。図の球は重なりを抑えた模式描画で、真のr/aと充填率は数式で示します。視点変更は幾何・原子数を変えません。

N_{\rm SC}=8\times\frac18=1,\quad N_{\rm BCC}=1+1=2,\quad N_{\rm FCC}=1+6\times\frac12=4 / a_{\rm SC}=2r,\quad\sqrt3a_{\rm BCC}=4r,\quad\sqrt2a_{\rm FCC}=4r / \eta=\frac{N(4\pi r^3/3)}{a^3}

データ・出典：教科書範囲の関係式による教育用モデル。実測データではありません。

模式図は実測画像や実験手順ではありません。入力は表示目的で丸めず、有限値・範囲を検証します。無効入力では直前の有効な状態を保ちます。表示は既存NumberDisplayの最大3桁と指数表記、数式は標準KaTeX 0.19.0（新しい拡張・CDNなし）です。

## 構成・検証・改良箇所

engine.jsはDOM非依存の計算とローカルデータ、tests.jsは化学・物質収支・境界の独立検証、drawing.jsは教材固有のSVG、script.jsは状態と操作です。説明・表示の変更はindex.html/style.css、数値モデルの変更はengine.js/tests.js、ラベルと図形の調整はdrawing.jsから行います。化学教材の入力・SVG基本部品のみ../shared/を再利用します。既存数学・物理を変更しません。

ルートで `node subjects/chemistry/crystal_lattices/tests.js`、全体は `python3 scripts/verify.py`。安全なプレビューと未追跡ファイルの追加はscripts/README.mdに従います。ブラウザ検証結果は全体の作業報告を参照してください。実機・Safari・Windowsの動作は別途確認が必要です。

## 実行した検証

Node独立テストと動的KaTeX検証：成功（PASS 4、FAIL 0）。実Chromiumで1366・820・390pxを確認し、全選択肢、主要入力、リセット、該当する再生停止・タッチ視点操作を全体テストで確認しました。実機iPad/スマートフォン、Safari/Firefox/Edge、Windowsでの実行は未検証です。Windowsの全体検証は `python scripts/verify.py` を使用してください。
