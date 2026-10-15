# 反応熱・エンタルピー・ヘスの法則

化学 · 熱化学。`index.html`を化学カタログから開きます。発熱・吸熱、反応の向き、係数倍を変えて準位差と2経路の和を比較します。

## モデル・仮定・例外

反応エンタルピーは生成物と反応物のエンタルピー差です。発熱では負、吸熱では正。状態量のため、直接経路でも2段階経路でも全体の差は同じです。図の準位は教育用の相対値で実測の標準生成エンタルピーではありません。逆反応は符号を反転し、反応式の係数をk倍するとΔHもk倍です。縦軸の単位は記述反応1 mol当たりのkJとして解釈します。活性化エネルギーや反応速度とΔHは異なります。平均結合エネルギーからの概算は気相・平均値の近似で、この準位図の数値とは区別します。

\Delta H=H_{\rm products}-H_{\rm reactants} / \Delta H_{\rm reverse}=-\Delta H_{\rm forward},\qquad \Delta H_{k\times}=k\Delta H / \Delta H_{\rm direct}=\Delta H_1+\Delta H_2

データ・出典：教科書範囲の関係式による教育用モデル。実測データではありません。

模式図は実測画像や実験手順ではありません。入力は表示目的で丸めず、有限値・範囲を検証します。無効入力では直前の有効な状態を保ちます。表示は既存NumberDisplayの最大3桁と指数表記、数式は標準KaTeX 0.19.0（新しい拡張・CDNなし）です。

## 構成・検証・改良箇所

engine.jsはDOM非依存の計算とローカルデータ、tests.jsは化学・物質収支・境界の独立検証、drawing.jsは教材固有のSVG、script.jsは状態と操作です。説明・表示の変更はindex.html/style.css、数値モデルの変更はengine.js/tests.js、ラベルと図形の調整はdrawing.jsから行います。化学教材の入力・SVG基本部品のみ../shared/を再利用します。既存数学・物理を変更しません。

ルートで `node subjects/chemistry/thermochemistry/tests.js`、全体は `python3 scripts/verify.py`。安全なプレビューと未追跡ファイルの追加はscripts/README.mdに従います。ブラウザ検証結果は全体の作業報告を参照してください。実機・Safari・Windowsの動作は別途確認が必要です。

## 実行した検証

Node独立テストと動的KaTeX検証：成功（PASS 4、FAIL 0）。実Chromiumで1366・820・390pxを確認し、全選択肢、主要入力、リセット、該当する再生停止・タッチ視点操作を全体テストで確認しました。実機iPad/スマートフォン、Safari/Firefox/Edge、Windowsでの実行は未検証です。Windowsの全体検証は `python scripts/verify.py` を使用してください。
