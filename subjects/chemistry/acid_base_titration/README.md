# 中和滴定と滴定曲線

化学基礎・化学 · 中和滴定。`index.html`を化学カタログから開きます。試料濃度・体積、滴定液濃度・加えた体積を操作します。

## モデル・仮定・例外

25℃の一価強酸（HCl型）と強塩基（NaOH型）の滴定です。混合全体積と自己解離からpHを求めます。弱酸滴定は未収録で、強酸式を流用しません。0.1 Mの試料25 mLを0.1 M塩基で滴定すると当量点25 mL、pH≈7です。当量点前後は連続な式で評価します。BTBの代表変色域6.0〜7.6は目安で、フラスコや指示薬は実物色調の精密再現ではありません。

V_{\rm eq}=\frac{c_aV_a}{c_b},\quad n_{\rm excess}=c_aV_a-c_bV_b,\quad V_{\rm total}=V_a+V_b

データ・出典：教科書範囲の関係式による教育用モデル。実測データではありません。

模式図は実測画像や実験手順ではありません。入力は表示目的で丸めず、有限値・範囲を検証します。無効入力では直前の有効な状態を保ちます。表示は既存NumberDisplayの最大3桁と指数表記、数式は標準KaTeX 0.19.0（新しい拡張・CDNなし）です。

## 構成・検証・改良箇所

engine.jsはDOM非依存の計算とローカルデータ、tests.jsは化学・物質収支・境界の独立検証、drawing.jsは教材固有のSVG、script.jsは状態と操作です。説明・表示の変更はindex.html/style.css、数値モデルの変更はengine.js/tests.js、ラベルと図形の調整はdrawing.jsから行います。化学教材の入力・SVG基本部品のみ../shared/を再利用します。既存数学・物理を変更しません。

ルートで `node subjects/chemistry/acid_base_titration/tests.js`、全体は `python3 scripts/verify.py`。安全なプレビューと未追跡ファイルの追加はscripts/README.mdに従います。ブラウザ検証結果は全体の作業報告を参照してください。実機・Safari・Windowsの動作は別途確認が必要です。

## 実行した検証

Node独立テストと動的KaTeX検証：成功（PASS 4、FAIL 0）。実Chromiumで1366・820・390pxを確認し、全選択肢、主要入力、リセット、該当する再生停止・タッチ視点操作を全体テストで確認しました。実機iPad/スマートフォン、Safari/Firefox/Edge、Windowsでの実行は未検証です。Windowsの全体検証は `python scripts/verify.py` を使用してください。
