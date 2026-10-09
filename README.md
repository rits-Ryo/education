# education

教科ごとのインタラクティブなWeb教材です。

## 公開ページと階層

<https://rits-ryo.github.io/education/> から、教科、教材の順に選びます。

- エントランス：リポジトリ直下の index.html
- 数学：subjects/math/index.html → 2次関数の最大・最小
- 物理：subjects/physics/index.html（教材の追加予定）
- 化学：subjects/chemistry/index.html（教材の追加予定）
- 英語：subjects/english/index.html（教材の追加予定）

PC・iPadのブラウザで利用できます。GitHub Pagesの公開元は対象ブランチの /(root) です。教材のURLは subjects/math/Quadratic_function/max_min.html です。

## ファイルの役割

- catalog-data.js：教科・教材の登録データ。タイトル、説明、リンク、タグを一か所で管理します。
- catalog.js：入口・教科別ページの共通表示処理。
- catalog.css：入口・教科別ページの共通デザイン。
- subjects/：教科別の一覧ページ。教材の計算や描画のコードは置きません。
- subjects/math/Quadratic_function/：二次関数の最大・最小専用のHTML・CSS・JavaScript・テスト・操作説明。共通の一覧や別教材の実装は置きません。

教材本体は独立したフォルダーで管理します。入口・教科別一覧から教材へリンクし、教材の計算処理は共通カタログに依存しません。教材の説明は [2次関数の最大・最小のREADME](subjects/math/Quadratic_function/README.md) を参照してください。

## 既存の教科へ教材を追加する

1. 該当する subjects/教科/ の下に新しい教材専用のフォルダーを作成し、HTML・CSS・JavaScriptなどを配置します。二次関数の最大・最小以外の教材を subjects/math/Quadratic_function/ に追加しないでください。
2. catalog-data.js の該当教科の materials 配列に項目を追加します。既存の数学の教材登録が例です。
3. id（教科内で一意）、title、category、description、path、tags を指定します。path はリポジトリ直下を基準にした相対パス（例：subjects/math/New_material/index.html）です。大文字・小文字を正確に合わせてください。
4. 教材に教科別一覧へ戻るリンクを設け、入口 → 教科 → 教材 → 教科の移動を確認します。

登録データの変更は入口の教材数と教科別一覧の両方に反映されます。教材が0件の教科は追加予定と表示され、存在しない教材へのリンクは生成されません。公開する項目のみ登録し、機密情報・ローカル環境情報を含めないでください。

## 教科を追加する

1. catalog-data.js の subjects 配列に、新しい id、title、description、path、materials を追加します。
2. subjects/ の既存ページを複製し、body の data-subject を登録した id に変更します。ページタイトルとパンくずの教科名も変更してください。
3. 入口の noscript 内の教科リンクも追加します。JavaScript無効時の案内に使用します。

一覧は共通のJavaScriptで描画されます。ビルドや外部ライブラリは不要です。共通ファイルを相対パスで読み込むため、GitHub Pagesのリポジトリ名を含むURLでも利用できます。
