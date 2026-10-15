# 酸化還元と酸化数

化学基礎 · 酸化還元。`index.html`を化学カタログから開きます。反応・係数倍を選び、電子移動を再生・停止します。

## モデル・仮定・例外

酸化は電子を失い酸化数が増すこと、還元は電子を受け取り酸化数が減ることです。酸化数は結合電子を割り当てた形式的数で、形式電荷とは異なります。全反応・半反応とも元素と電荷を保存します。Fe²⁺の例は酸化半反応だけで、電子を受け取る相手を含む全反応ではありません。電子移動は概念図で顕微鏡映像ではなく、係数倍で電子数も比例します。

\mathrm{Zn}\to\mathrm{Zn}^{2+}+2e^-,\quad\mathrm{Cu}^{2+}+2e^-\to\mathrm{Cu} / \mathrm{Fe}^{2+}\to\mathrm{Fe}^{3+}+e^-

データ・出典：教科書範囲の関係式による教育用モデル。実測データではありません。

模式図は実測画像や実験手順ではありません。入力は表示目的で丸めず、有限値・範囲を検証します。無効入力では直前の有効な状態を保ちます。表示は既存NumberDisplayの最大3桁と指数表記、数式は標準KaTeX 0.19.0（新しい拡張・CDNなし）です。

## 構成・検証・改良箇所

engine.jsはDOM非依存の計算とローカルデータ、tests.jsは化学・物質収支・境界の独立検証、drawing.jsは教材固有のSVG、script.jsは状態と操作です。説明・表示の変更はindex.html/style.css、数値モデルの変更はengine.js/tests.js、ラベルと図形の調整はdrawing.jsから行います。化学教材の入力・SVG基本部品のみ../shared/を再利用します。既存数学・物理を変更しません。

ルートで `node subjects/chemistry/oxidation_reduction/tests.js`、全体は `python3 scripts/verify.py`。安全なプレビューと未追跡ファイルの追加はscripts/README.mdに従います。ブラウザ検証結果は全体の作業報告を参照してください。実機・Safari・Windowsの動作は別途確認が必要です。

## 実行した検証

Node独立テストと動的KaTeX検証：成功（PASS 5、FAIL 0）。実Chromiumで1366・820・390pxを確認し、全選択肢、主要入力、リセット、該当する再生停止・タッチ視点操作を全体テストで確認しました。実機iPad/スマートフォン、Safari/Firefox/Edge、Windowsでの実行は未検証です。Windowsの全体検証は `python scripts/verify.py` を使用してください。
