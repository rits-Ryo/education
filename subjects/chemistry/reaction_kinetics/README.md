# 化学反応速度・活性化エネルギー

化学 · 反応速度。`index.html`を化学カタログから開きます。次数・濃度・k・時刻と、比較温度・Eaを変更します。

## モデル・仮定・例外

反応次数は実験で決まる速度式の指数で、全反応式の係数から一般には決まりません。0次は濃度が尽きるまで直線、1次は指数、2次は1/(1+kt[A]₀)型です。kの単位は0次 mol L⁻¹ s⁻¹、1次 s⁻¹、2次 L mol⁻¹ s⁻¹です。濃度曲線は入力kを固定した比較で、温度欄は別パネルの298.15 Kに対する相対kを計算します。前因子・Ea一定のArrhenius近似です。触媒はより低いEaの経路を提供しますが、同温度の平衡定数や反応エンタルピーを変えません。0次で濃度が尽きた後は反応を停止させ、負濃度を作りません。

-\frac{d[A]}{dt}=k[A]^m,\qquad [A]_{m=1}=[A]_0e^{-kt} / \frac{k(T_2)}{k(T_1)}=\exp\left[-\frac{E_a}{R}\left(\frac1{T_2}-\frac1{T_1}\right)\right]

データ・出典：教科書範囲の関係式による教育用モデル。実測データではありません。

模式図は実測画像や実験手順ではありません。入力は表示目的で丸めず、有限値・範囲を検証します。無効入力では直前の有効な状態を保ちます。表示は既存NumberDisplayの最大3桁と指数表記、数式は標準KaTeX 0.19.0（新しい拡張・CDNなし）です。

## 構成・検証・改良箇所

engine.jsはDOM非依存の計算とローカルデータ、tests.jsは化学・物質収支・境界の独立検証、drawing.jsは教材固有のSVG、script.jsは状態と操作です。説明・表示の変更はindex.html/style.css、数値モデルの変更はengine.js/tests.js、ラベルと図形の調整はdrawing.jsから行います。化学教材の入力・SVG基本部品のみ../shared/を再利用します。既存数学・物理を変更しません。

ルートで `node subjects/chemistry/reaction_kinetics/tests.js`、全体は `python3 scripts/verify.py`。安全なプレビューと未追跡ファイルの追加はscripts/README.mdに従います。ブラウザ検証結果は全体の作業報告を参照してください。実機・Safari・Windowsの動作は別途確認が必要です。

## 実行した検証

Node独立テストと動的KaTeX検証：成功（PASS 5、FAIL 0）。実Chromiumで1366・820・390pxを確認し、全選択肢、主要入力、リセット、該当する再生停止・タッチ視点操作を全体テストで確認しました。実機iPad/スマートフォン、Safari/Firefox/Edge、Windowsでの実行は未検証です。Windowsの全体検証は `python scripts/verify.py` を使用してください。
