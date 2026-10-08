# education

数学を視覚的に学ぶWeb教材です。

## 公開ページ

<https://rits-ryo.github.io/education/> は教材一覧です。各教材の「教材を開く」から利用できます。iPadではSafariで開いてください。

現在の教材：

- [最大・最小ラボ](Quadratic_function/max_min.html)：二次関数の最大値・最小値、定義域、パラメータによる場合分け。

GitHub Pagesの公開元は、公開するブランチの `/(root)` にしてください。トップページは `index.html`、一覧のデザインは `catalog.css` です。`.nojekyll` を置き、静的ファイルとして公開します。変更をGitHubに反映し、Pagesのデプロイが完了すると更新されます。

## 教材を追加する

1. 教材ごとのフォルダを作成し、HTML・CSS・JavaScriptなどを配置します。
2. `index.html` の `<article class="material">` を複製します。
3. 科目・タイトル・説明・機能タグ・イラストを新しい教材に合わせて変更します。
4. 「教材を開く」の `href` を `./新しいフォルダ/教材.html` のような相対パスにします。GitHub Pagesでは大文字・小文字を正しく合わせてください。
5. トップページから教材を開けることを確認し、このREADMEの教材一覧にも追加します。

教材一覧はJavaScriptなしで表示されます。カードは画面幅に応じて自動的に並び替わります。

教材の起動方法・操作方法・計算の制限は [最大・最小ラボのREADME](Quadratic_function/README.md) を参照してください。
