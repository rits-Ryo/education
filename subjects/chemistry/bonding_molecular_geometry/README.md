# 化学結合と分子の形

化学基礎・化学 · 結合。`index.html`を化学カタログから開きます。分子を選び、図をドラッグまたは方位・仰角で回転します。下のルイス式は視点と独立です。

## モデル・仮定・例外

共有結合は結合電子対、イオン結合は陽・陰イオン間の静電的相互作用です。金属結合は金属陽イオンの集まりと結晶全体に広がる電子で説明し、個別の分子として扱いません。VSEPRは電子対の反発による近似モデルです。孤立電子対によりCH₄・NH₃・H₂Oで結合角が異なります。BF₃のBは6電子でオクテット則の例外です。極性のある結合でも対称なCO₂・BF₃では双極子が打ち消されます。補助図は結合を線、孤立電子対を点2個で示すルイス式です。空間模型の陰影や球は電子の実測位置ではありません。NaClの結晶を単独の分子と区別します。

\mathrm{CO_2}:\quad \mathrm O=\mathrm C=\mathrm O / \mathrm{CH_4}\approx109.5^\circ,\ \mathrm{NH_3}\approx107^\circ,\ \mathrm{H_2O}\approx104.5^\circ

データ・出典：高校教科書のVSEPR・代表角。CH₄の模型は理想正四面体。NaClは結晶の模式的な一部分。

模式図は実測画像や実験手順ではありません。入力は表示目的で丸めず、有限値・範囲を検証します。無効入力では直前の有効な状態を保ちます。表示は既存NumberDisplayの最大3桁と指数表記、数式は標準KaTeX 0.19.0（新しい拡張・CDNなし）です。

## 構成・検証・改良箇所

engine.jsはDOM非依存の計算とローカルデータ、tests.jsは化学・物質収支・境界の独立検証、drawing.jsは教材固有のSVG、script.jsは状態と操作です。説明・表示の変更はindex.html/style.css、数値モデルの変更はengine.js/tests.js、ラベルと図形の調整はdrawing.jsから行います。化学教材の入力・SVG基本部品のみ../shared/を再利用します。既存数学・物理を変更しません。

ルートで `node subjects/chemistry/bonding_molecular_geometry/tests.js`、全体は `python3 scripts/verify.py`。安全なプレビューと未追跡ファイルの追加はscripts/README.mdに従います。ブラウザ検証結果は全体の作業報告を参照してください。実機・Safari・Windowsの動作は別途確認が必要です。

## 実行した検証

Node独立テストと動的KaTeX検証：成功（PASS 5、FAIL 0）。実Chromiumで1366・820・390pxを確認し、全選択肢、主要入力、リセット、該当する再生停止・タッチ視点操作を全体テストで確認しました。実機iPad/スマートフォン、Safari/Firefox/Edge、Windowsでの実行は未検証です。Windowsの全体検証は `python scripts/verify.py` を使用してください。

金属結合の追加模型はM⁺8個と自由電子8個の抽象模型で、特定元素の実測構造・電子位置ではありません。
