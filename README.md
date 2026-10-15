# education

## 共通フォント

本文のフォントは `typography.css` の `--font-body` で一元管理し、Google FontsからBIZ UDPGothicの400・700を読み込みます。本文の基本サイズは17px、ウェイト400、行間1.8、見出しは700です。補助ラベルは小さめのサイズを維持しています。数式専用のフォントとコードの等幅フォントは変更しません。

Noto Sans JPと比較する場合は、同ファイルのGoogle FontsのURLに `family=Noto+Sans+JP:wght@400;700` を追加し、`--font-body` の先頭を `'Noto Sans JP'` に変更してください。Google Fontsに接続できない場合は指定した代替フォントで表示します。

教科ごとのインタラクティブなWeb教材です。

## 公開ページと階層

<https://rits-ryo.github.io/education/> から、教科、教材の順に選びます。

- エントランス：リポジトリ直下の index.html
- 数学：subjects/math/index.html → 2次関数の最大・最小、因数分解・展開の公式、完全順列、単位円と三角関数、微分、定積分と面積・区分求積法
- 物理：subjects/physics/index.html → 等加速度直線運動、波の重ね合わせと干渉、電場と電位
- 化学：subjects/chemistry/index.html（化学基礎・化学の20教材）
- 英語：subjects/english/index.html（教材の追加予定）

PC・iPadのブラウザで利用できます。GitHub Pagesの公開元は対象ブランチの /(root) です。教材のURLは subjects/math/Quadratic_function/max_min.html です。

## ファイルの役割

- catalog-data.js：教科・教材の登録データ。タイトル、説明、リンク、タグを一か所で管理します。
- catalog.js：入口・教科別ページの共通表示処理。
- catalog.css：入口・教科別ページの共通デザイン。
- subjects/：教科別の一覧ページ。教材の計算や描画のコードは置きません。
- subjects/math/Quadratic_function/：二次関数の最大・最小専用のHTML・CSS・JavaScript・テスト・操作説明。共通の一覧や別教材の実装は置きません。
- subjects/math/derangement/：完全順列の公式・証明・例題と、小さい数での計算・列挙。
- subjects/math/trigonometric_functions/：単位円と三角関数の連動、弧度法、相互関係、グラフの変形。
- subjects/math/differentiation/：平均変化率、接線と導関数の連動、増減・極値、微分可能性。
- subjects/math/integration/：定積分と符号付き面積、長方形の近似、区分求積法のΣと極限。
- subjects/physics/kinematics/：1次元等加速度運動と3グラフ・符号付き面積。
- subjects/physics/wave_interference/：同振動数の2波源による重ね合わせ・干渉と観測点の時間波形。
- subjects/physics/electric_field_potential/：3次元点電荷の平面断面で電場・電気力線・電位・等電位線を表示。

教材本体は独立したフォルダーで管理します。入口・教科別一覧から教材へリンクし、教材の計算処理は共通カタログに依存しません。教材の説明は [2次関数の最大・最小のREADME](subjects/math/Quadratic_function/README.md) を参照してください。

## 新規高校数学10教材

既存数学7教材に加え、以下の独立した教材を数学カタログに登録しています。各フォルダーのREADMEに操作・数学的条件・改良箇所を記載しています。

| 教材 | 分野 | 主な操作 |
| --- | --- | --- |
| [二次不等式とグラフの符号](subjects/math/quadratic_inequalities/README.md) | 数学Ⅰ · 二次不等式 | 判別式・解集合 |
| [三角形と正弦定理・余弦定理](subjects/math/triangle_theorems/README.md) | 数学Ⅰ · 図形と計量 | 頂点ドラッグ・正弦定理 |
| [確率の試行と相対度数](subjects/math/probability_simulation/README.md) | 数学A · 確率 | 相対度数・再現シード |
| [数列と漸化式](subjects/math/sequences_recursion/README.md) | 数学B · 数列 | 一般項・符号交代 |
| [二項分布と期待値・分散](subjects/math/binomial_distribution/README.md) | 数学B · 確率分布 | 理論分布・累積確率 |
| [指数関数と対数関数・逆関数](subjects/math/exponential_logarithmic/README.md) | 数学Ⅱ · 指数・対数 | 逆関数・対応点 |
| [円と直線の位置関係](subjects/math/circle_and_line/README.md) | 数学Ⅱ · 図形と方程式 | 交点・接線 |
| [複素数平面と回転・乗算](subjects/math/complex_plane/README.md) | 数学C · 複素数平面 | 伸縮と回転・成分の操作 |
| [空間ベクトルと内積・位置関係](subjects/math/spatial_vectors/README.md) | 数学C · 空間ベクトル | 視点の回転・3次元の内積 |
| [関数の極限と連続性](subjects/math/limits_and_continuity/README.md) | 数学Ⅲ · 極限への導入 | 左右の極限・関数の穴 |

各教材はengine.js（計算）・drawing.js（SVG）・script.js（操作）を分離しています。既存KaTeX 0.19.0、数値表示の最大3桁、入力・内部計算の精度を共通ルールとして維持します。新規10教材のtests.jsは共通verifyにも含めています。

## 高校化学20教材

各教材は独立した計算・描画・操作・説明・テストを持ち、既存KaTeX 0.19.0とNumberDisplayを利用します。化学専用の `subjects/chemistry/shared/` は入力とSVG基本部品だけを共有し、科学モデルは各engine.jsに分離しています。標準KaTeXの `\mathrm`・添字・電荷・矢印を使用し、未収録の化学拡張は使いません。

| 教材 | 分野 |
| --- | --- |
| [原子の構造と電子配置](subjects/chemistry/atomic_structure/README.md) | 化学基礎 · 物質の構成 |
| [周期表と元素の周期性](subjects/chemistry/periodic_trends/README.md) | 化学基礎 · 周期表 |
| [化学結合と分子の形](subjects/chemistry/bonding_molecular_geometry/README.md) | 化学基礎・化学 · 結合 |
| [mol・アボガドロ定数・反応量論](subjects/chemistry/mole_stoichiometry/README.md) | 化学基礎 · 物質量 |
| [溶液の濃度・希釈・混合](subjects/chemistry/solution_concentration/README.md) | 化学基礎 · 溶液 |
| [気体の状態方程式と気体法則](subjects/chemistry/gas_laws/README.md) | 化学 · 気体 |
| [状態変化・相図・蒸気圧](subjects/chemistry/phase_diagram/README.md) | 化学基礎・化学 · 状態 |
| [反応熱・エンタルピー・ヘスの法則](subjects/chemistry/thermochemistry/README.md) | 化学 · 熱化学 |
| [化学反応速度・活性化エネルギー](subjects/chemistry/reaction_kinetics/README.md) | 化学 · 反応速度 |
| [化学平衡・平衡定数と反応商](subjects/chemistry/chemical_equilibrium/README.md) | 化学 · 化学平衡 |
| [ルシャトリエの原理・平衡移動](subjects/chemistry/le_chatelier/README.md) | 化学 · 平衡移動 |
| [酸・塩基とpH](subjects/chemistry/acid_base_ph/README.md) | 化学基礎 · 酸塩基 |
| [中和滴定と滴定曲線](subjects/chemistry/acid_base_titration/README.md) | 化学基礎・化学 · 中和滴定 |
| [緩衝液とヘンダーソン・ハッセルバルヒの式](subjects/chemistry/buffer_solution/README.md) | 化学 · 酸塩基平衡 |
| [溶解度積と沈殿生成](subjects/chemistry/solubility_product/README.md) | 化学 · 溶解平衡 |
| [酸化還元と酸化数](subjects/chemistry/oxidation_reduction/README.md) | 化学基礎 · 酸化還元 |
| [電池・標準電極電位](subjects/chemistry/galvanic_cell/README.md) | 化学 · 電池 |
| [電気分解とファラデーの法則](subjects/chemistry/electrolysis_faraday/README.md) | 化学 · 電気分解 |
| [結晶構造・単位格子](subjects/chemistry/crystal_lattices/README.md) | 化学 · 固体構造 |
| [有機化合物の構造と異性体](subjects/chemistry/organic_isomerism/README.md) | 化学 · 有機化学 |

理想モデル・濃度近似・温度・単位・データ出典を各ページに明記します。厳密な定義定数を保ち、表示だけ最大3桁とし、微小な非零値を指数表記します。実験手順やクイズはありません。全20件のtests.jsを共通verifyに登録しています。

## 既存の教科へ教材を追加する

1. 該当する subjects/教科/ の下に新しい教材専用のフォルダーを作成し、HTML・CSS・JavaScriptなどを配置します。二次関数の最大・最小以外の教材を subjects/math/Quadratic_function/ に追加しないでください。
2. catalog-data.js の該当教科の materials 配列に項目を追加します。既存の数学の教材登録が例です。
3. id（教科内で一意）、title、category、description、path、tags を指定します。path はリポジトリ直下を基準にした相対パス（例：subjects/math/New_material/index.html）です。大文字・小文字を正確に合わせてください。
4. 教材に教科別一覧へ戻るリンクを設け、入口 → 教科 → 教材 → 教科の移動を確認します。

登録データの変更は入口の教材数と教科別一覧の両方に反映されます。教材が0件の教科は追加予定と表示され、存在しない教材へのリンクは生成されません。公開する項目のみ登録し、機密情報・ローカル環境情報を含めないでください。

## 数値表示の共通ルール

1. 計算結果・座標・目盛り・動的な数式の数値は、小数点以下最大3桁に四捨五入して表示します。
2. 不要な末尾の0を省略し、整数は整数、負の0は0として表示します。不正な数値は `—` とし、定義されない結果には教材の説明を付けます。
3. 内部計算の精度と入力精度を維持します。編集中の数値入力を表示用に丸めません。
4. 表示用の文字列や丸め値を計算・大小比較・等号判定・零判定に使用しません。
5. 分数・根号・πなどの厳密値、定義・証明・入力制約で必要な正確な数値を維持します。
6. 丸めた値には必要に応じて `≈`・`≒` や「表示値は近似」の説明を付けます。微小な非零値を厳密な0と誤認させないようにします。
7. 物理・化学を含む新規教材も、共通の `number-format.js` を利用します。新しいビルド工程は不要です。

`subjects/教科/教材/` のHTMLで教材のスクリプトより前に読み込みます。

```html
<script defer src="../../../number-format.js"></script>
```

```js
NumberDisplay.formatNumber(1 / 3);      // "0.333"
NumberDisplay.formatNumber(2.9999);     // "3"
NumberDisplay.formatNonzero(-0.00001); // "-1 × 10^-5"
```

`formatNumber(value)` は有限のNumberだけを受け取り、桁区切りなしの表示文字列を返します。通常の丸めで0になる非零値を区別する必要がある場面では `formatNonzero(value)` を使用します。その場合だけ指数表記を使い、仮数も小数点以下最大3桁・末尾0なしにします。

Numberの表現範囲を下回る十進数積の表示には `formatScientific(仮数, 指数)` を使用できます。計算用の値・符号・厳密な直交判定はベクトル教材の既存ロジックが保持します。共通処理は表示文字列だけを生成します。

共通処理の独立テストは `node scripts/number-format-tests.js` で実行でき、`python3 scripts/verify.py` の必須検証にも含まれます。

## 数式表示の共通ルール（KaTeX）

数学・物理の全教材は **KaTeX 0.19.0** を使用します。化学などの新規教材も同じ方式を利用してください。本文は既存のBIZ UDPGothic設定を維持し、数式はKaTeX標準フォントとMathMLを使用します。

CDNは導入が軽い一方で外部通信に依存します。このサイトではGitHub Pagesから配信でき、オフラインのプレビューでも数式を表示できるセルフホスティングを採用しました。`vendor/katex-0.19.0/` に圧縮済みJS・CSS、自動組版拡張、WOFF2フォント20種、MITライセンスの `LICENSE` を配置しています。ソース、開発用依存、他の拡張、WOFF/TTFは含めません。CSSのフォント参照もWOFF2だけにしています。現行のChrome・Safari・Firefox・Edgeを対象とし、古いWOFF2非対応ブラウザは対象外です。

教材HTMLでは共通CSSと以下のスクリプトを教材制御スクリプトより前に読み込みます。

```html
<link rel="stylesheet" href="../../../vendor/katex-0.19.0/katex.min.css">
<link rel="stylesheet" href="../../../math-display.css">
<script defer src="../../../vendor/katex-0.19.0/katex.min.js"></script>
<script defer src="../../../vendor/katex-0.19.0/auto-render.min.js"></script>
<script defer src="../../../math-display.js"></script>
<script defer src="../../../number-format.js"></script>
```

静的な文章中の短い式は `\(...\)`、独立した式は `\[...\]` と記述します。HTML属性の `data-latex` でも指定できます。式変形は `aligned` を使い、等号の前の `&` と `\\` で位置を揃えます。HTMLでは `&` を `&amp;` として記述してください。長い式は数式領域を横スクロールさせ、本文全体を横にはみ出させたり数式を縮小したりしません。

```html
<p>速度は \(v(t)=v_0+at\) です。</p>
<div class="math-block" data-latex="\int_0^1 x^2\,dx=\frac13" data-display="true">
  \[\int_0^1 x^2\,dx=\frac13\]
</div>
```

静的な数式は読み込み時に一度だけ `MathDisplay.renderMathInContainer(document.body)` で組版されます。追加したコンテナーを組版する場合は同じAPIに対象要素を渡します。入力欄、ネイティブの選択肢、コード、SVGは自動処理の対象外です。選択肢・グラフの短い軸ラベルや単位は通常の文字として残し、本文・式の説明・計算結果はLaTeXで表示します。

動的な式は `MathDisplay.renderMath(element, latex, { displayMode: true })` で対象要素だけを更新します。同じ要素の式が変わらなければ再組版しません。ページ全体の再組版やMutationObserverによる常時監視は行いません。

```js
const latex = String.raw`v(t)\approx ${MathDisplay.number(velocity)}\,\mathrm{m/s}`;
MathDisplay.renderMath(document.getElementById('velocity'), latex);
```

数値は `MathDisplay.number(value)` または `NumberDisplay` の表示文字列を `MathDisplay.token()` でLaTeX化して使います。計算結果は最大3桁、末尾0なし、微小な非零値は指数表記です。分数・根号・πなどの厳密値と、意味のある精度の物理定数は維持します。表示結果を計算や判定へ戻しません。`token()` は既存エンジンの短い表示トークン用で、任意の式のパーサーではありません。ユーザーの式は教材の既存パーサーで検証した後、ASTと検証済みの入力元を `MathDisplay.ast(ast, { source: input })` に渡して組版します。入力元のπ・e・数値リテラルを保持し、結果の表示丸めとは区別します。既存パーサーのlog/lnはMath.log（自然対数）なので、組版ではlnに統一します。日本語などの説明は `MathDisplay.text()` でエスケープします。

設定は `trust: false`、`strict: 'error'`、`throwOnError: true`、展開回数・サイズの上限付きです。エラーはコンソールと `data-math-error` に記録し、元のTeXを赤い代替表示で残してfalseを返します。ライブラリを読み込めない場合も教材の操作を停止しません。エラーを成功扱いにはしません。

更新時は [公式配布手順](https://katex.org/docs/browser.html) と変更履歴を確認し、固定版のnpm配布物から必要なファイルとLICENSEを更新します。公開されたtarballのSHA-512 integrityを検証し、CSSのWOFF/TTF参照を削除し、フォント20種を一緒に更新してください。フォルダー名と全教材の参照、版を検証するテストも更新し、`node scripts/math-display-tests.js` と共通verify、ブラウザ表示を確認します。利用時にnpmや新しいビルド工程は不要です。

## 教科を追加する

1. catalog-data.js の subjects 配列に、新しい id、title、description、path、materials を追加します。
2. subjects/ の既存ページを複製し、body の data-subject を登録した id に変更します。ページタイトルとパンくずの教科名も変更してください。
3. 入口の noscript 内の教科リンクも追加します。JavaScript無効時の案内に使用します。

一覧は共通のJavaScriptで描画されます。ビルドや外部ライブラリは不要です。共通ファイルを相対パスで読み込むため、GitHub Pagesのリポジトリ名を含むURLでも利用できます。
