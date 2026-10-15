# 化学平衡・平衡定数と反応商

化学 · 化学平衡。`index.html`を化学カタログから開きます。初濃度・K・速度・時間を変更します。再生で30秒まで進み、粒子の双方向移動を表示します。

## モデル・仮定・例外

厳密な平衡定数は活動度で定義します。ここでは標準状態をそろえた希薄系の濃度近似でA⇄Bを扱い、kf/kr=Kとします。総濃度は保存し、同じ温度では初濃度を変えてもKを変更しません。Q&lt;Kなら正反応方向、Q&gt;Kなら逆反応方向です。総濃度2、K=3なら平衡濃度A=0.5、B=1.5です。平衡では正逆速度が等しいだけで、物質がある限り両反応は続きます。粒子図は双方向の動的平衡の模式表示です。

\mathrm A\rightleftharpoons\mathrm B,\qquad K=\frac{[B]_{\rm eq}}{[A]_{\rm eq}},\quad Q=\frac{[B]}{[A]} / [A]+[B]=C_{\rm total},\qquad v_f=k_f[A],\quad v_r=k_r[B]

データ・出典：教科書範囲の関係式による教育用モデル。実測データではありません。

模式図は実測画像や実験手順ではありません。入力は表示目的で丸めず、有限値・範囲を検証します。無効入力では直前の有効な状態を保ちます。表示は既存NumberDisplayの最大3桁と指数表記、数式は標準KaTeX 0.19.0（新しい拡張・CDNなし）です。

## 構成・検証・改良箇所

engine.jsはDOM非依存の計算とローカルデータ、tests.jsは化学・物質収支・境界の独立検証、drawing.jsは教材固有のSVG、script.jsは状態と操作です。説明・表示の変更はindex.html/style.css、数値モデルの変更はengine.js/tests.js、ラベルと図形の調整はdrawing.jsから行います。化学教材の入力・SVG基本部品のみ../shared/を再利用します。既存数学・物理を変更しません。

ルートで `node subjects/chemistry/chemical_equilibrium/tests.js`、全体は `python3 scripts/verify.py`。安全なプレビューと未追跡ファイルの追加はscripts/README.mdに従います。ブラウザ検証結果は全体の作業報告を参照してください。実機・Safari・Windowsの動作は別途確認が必要です。

## 実行した検証

Node独立テストと動的KaTeX検証：成功（PASS 4、FAIL 0）。実Chromiumで1366・820・390pxを確認し、全選択肢、主要入力、リセット、該当する再生停止・タッチ視点操作を全体テストで確認しました。実機iPad/スマートフォン、Safari/Firefox/Edge、Windowsでの実行は未検証です。Windowsの全体検証は `python scripts/verify.py` を使用してください。
