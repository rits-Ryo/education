# 酸・塩基とpH

化学基礎 · 酸塩基。`index.html`を化学カタログから開きます。溶液・濃度・希釈倍率を変更します。イオン濃度は対数グラフで表示します。

## モデル・仮定・例外

25℃、希薄水溶液、1価の強酸・強塩基、完全電離、活動度≈濃度の模型です。濃度はmol/L、標準濃度c°=1 mol/Lで対数を無次元化します。[H⁺]が10倍になるとpHは1下がります。水の自己解離をすべての濃度で含め、極希薄酸を単純な−log cでpH&gt;7と誤表示しません。純水・c=0もpH≈7です。濃厚液、活量係数、温度によるKw変化は対象外で、濃度上限0.1 mol/Lです。

K_w=[\mathrm H^+][\mathrm{OH}^-]\approx10^{-14}\quad(25^\circ\mathrm C) / \mathrm{pH}=-\log_{10}a(\mathrm H^+)\approx-\log_{10}([\mathrm H^+]/c^\circ)

データ・出典：教科書範囲の関係式による教育用モデル。実測データではありません。

模式図は実測画像や実験手順ではありません。入力は表示目的で丸めず、有限値・範囲を検証します。無効入力では直前の有効な状態を保ちます。表示は既存NumberDisplayの最大3桁と指数表記、数式は標準KaTeX 0.19.0（新しい拡張・CDNなし）です。

## 構成・検証・改良箇所

engine.jsはDOM非依存の計算とローカルデータ、tests.jsは化学・物質収支・境界の独立検証、drawing.jsは教材固有のSVG、script.jsは状態と操作です。説明・表示の変更はindex.html/style.css、数値モデルの変更はengine.js/tests.js、ラベルと図形の調整はdrawing.jsから行います。化学教材の入力・SVG基本部品のみ../shared/を再利用します。既存数学・物理を変更しません。

ルートで `node subjects/chemistry/acid_base_ph/tests.js`、全体は `python3 scripts/verify.py`。安全なプレビューと未追跡ファイルの追加はscripts/README.mdに従います。ブラウザ検証結果は全体の作業報告を参照してください。実機・Safari・Windowsの動作は別途確認が必要です。

## 実行した検証

Node独立テストと動的KaTeX検証：成功（PASS 4、FAIL 0）。実Chromiumで1366・820・390pxを確認し、全選択肢、主要入力、リセット、該当する再生停止・タッチ視点操作を全体テストで確認しました。実機iPad/スマートフォン、Safari/Firefox/Edge、Windowsでの実行は未検証です。Windowsの全体検証は `python scripts/verify.py` を使用してください。
