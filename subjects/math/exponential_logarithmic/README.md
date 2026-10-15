# 指数関数と対数関数・逆関数

数学Ⅱ · 指数・対数。`index.html` を数学カタログから開きます。静的HTML/CSS/Vanilla JavaScriptと既存KaTeX 0.19.0を使用します。追加ビルド・依存はありません。

## 操作と数学的条件

底とxを変えて、指数・対数の曲線と対称な対応点P・Qを動かします。図の範囲は±6です。

a=1、非正の底を拒否し、対数のx≤0はnullで扱います。計算範囲外は曲線を切り、0に置換しません。

結果は既存NumberDisplayで小数点以下最大3桁、微小な非零値は指数表記です。内部計算と入力を丸めません。表示の等号・近似記号を区別します。無効入力は説明を表示し、直前の有効な状態を維持します。

## ファイルと改良箇所

- engine.js：DOMを使わない数学ロジック。式や判定の変更はここから。
- tests.js：代表例・境界・未定義・内部精度の独立テスト。
- drawing.js：SVG描画と数学座標変換。ラベル配置・表示範囲の改良はここから。
- script.js：状態・入力・ドラッグ・数式の同期。
- index.html / style.css：説明と教材専用レスポンシブ表示。

ルートで `node subjects/math/exponential_logarithmic/tests.js`、全体は `python3 scripts/verify.py`。安全なプレビューはルートのscripts/README.mdに従います。実機Safari・iPad等は別途確認してください。
