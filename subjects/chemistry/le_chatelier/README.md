# ルシャトリエの原理・平衡移動

化学 · 平衡移動。`index.html`を化学カタログから開きます。添加・体積・温度を別々に操作し、変更直後と新平衡を比較します。

## モデル・仮定・例外

初期状態は1 L・298.15 Kでの平衡（Kの教育用模型値0.2）。添加・体積・温度の変更直後と新平衡を別々に示します。温度によるK変化には一定ΔH=+57 kJ/molのvan’t Hoff近似を使います。濃度を標準濃度1 mol/Lで規格化する活動度近似です。定温圧縮では気体分子数の少ないN₂O₄側へ移動しKは不変です。定容の不活性気体添加は反応物の分圧を変えず、平衡は移動しません。定圧条件は対象外です。図の色はNO₂の実測色・光路長を再現していません。

\mathrm{N_2O_4(g)}\rightleftharpoons2\mathrm{NO_2(g)} / Q=\frac{[\mathrm{NO_2}]^2}{[\mathrm{N_2O_4}]},\quad\ln\frac{K(T)}{K(T_0)}=-\frac{\Delta H}{R}\left(\frac1T-\frac1{T_0}\right)

データ・出典：K₀=0.2は教育用設定、ΔHは代表値+57 kJ/molの一定ΔH近似。精密実測予測ではありません。

模式図は実測画像や実験手順ではありません。入力は表示目的で丸めず、有限値・範囲を検証します。無効入力では直前の有効な状態を保ちます。表示は既存NumberDisplayの最大3桁と指数表記、数式は標準KaTeX 0.19.0（新しい拡張・CDNなし）です。

## 構成・検証・改良箇所

engine.jsはDOM非依存の計算とローカルデータ、tests.jsは化学・物質収支・境界の独立検証、drawing.jsは教材固有のSVG、script.jsは状態と操作です。説明・表示の変更はindex.html/style.css、数値モデルの変更はengine.js/tests.js、ラベルと図形の調整はdrawing.jsから行います。化学教材の入力・SVG基本部品のみ../shared/を再利用します。既存数学・物理を変更しません。

ルートで `node subjects/chemistry/le_chatelier/tests.js`、全体は `python3 scripts/verify.py`。安全なプレビューと未追跡ファイルの追加はscripts/README.mdに従います。ブラウザ検証結果は全体の作業報告を参照してください。実機・Safari・Windowsの動作は別途確認が必要です。

## 実行した検証

Node独立テストと動的KaTeX検証：成功（PASS 6、FAIL 0）。実Chromiumで1366・820・390pxを確認し、全選択肢、主要入力、リセット、該当する再生停止・タッチ視点操作を全体テストで確認しました。実機iPad/スマートフォン、Safari/Firefox/Edge、Windowsでの実行は未検証です。Windowsの全体検証は `python scripts/verify.py` を使用してください。
