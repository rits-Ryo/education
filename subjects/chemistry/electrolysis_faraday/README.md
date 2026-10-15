# 電気分解とファラデーの法則

化学 · 電気分解。`index.html`を化学カタログから開きます。電流・時間・モデルを変更し、電子移動を再生します。

## モデル・仮定・例外

F≈96485 C/mol、Cuモル質量63.55 g/molの代表値です。1 A・96485 sでは電子1 mol、Cu0.5 mol、31.775 gです。電流効率100%、副反応なし。陰極は負極で還元、陽極は正極で酸化し、電池放電時の正負とは区別します。銅モデルはCu陽極が溶解する理想系、水ではH₂:O₂=2:1です。再生は図の電子移動だけを動かし、通電時間を増やしません。

Q=It,\quad n(e^-)=\frac QF,\quad n(\mathrm{Cu})=\frac Q{2F},\quad m=nM / \mathrm{Cu}^{2+}+2e^-\to\mathrm{Cu} / 2\mathrm H_2\mathrm O\to2\mathrm H_2+\mathrm O_2

データ・出典：F≈96485 C/mol、Cu=63.55 g/molの教育用代表値。定義由来の全桁とは区別。

模式図は実測画像や実験手順ではありません。入力は表示目的で丸めず、有限値・範囲を検証します。無効入力では直前の有効な状態を保ちます。表示は既存NumberDisplayの最大3桁と指数表記、数式は標準KaTeX 0.19.0（新しい拡張・CDNなし）です。

## 構成・検証・改良箇所

engine.jsはDOM非依存の計算とローカルデータ、tests.jsは化学・物質収支・境界の独立検証、drawing.jsは教材固有のSVG、script.jsは状態と操作です。説明・表示の変更はindex.html/style.css、数値モデルの変更はengine.js/tests.js、ラベルと図形の調整はdrawing.jsから行います。化学教材の入力・SVG基本部品のみ../shared/を再利用します。既存数学・物理を変更しません。

ルートで `node subjects/chemistry/electrolysis_faraday/tests.js`、全体は `python3 scripts/verify.py`。安全なプレビューと未追跡ファイルの追加はscripts/README.mdに従います。ブラウザ検証結果は全体の作業報告を参照してください。実機・Safari・Windowsの動作は別途確認が必要です。

## 実行した検証

Node独立テストと動的KaTeX検証：成功（PASS 5、FAIL 0）。実Chromiumで1366・820・390pxを確認し、全選択肢、主要入力、リセット、該当する再生停止・タッチ視点操作を全体テストで確認しました。実機iPad/スマートフォン、Safari/Firefox/Edge、Windowsでの実行は未検証です。Windowsの全体検証は `python scripts/verify.py` を使用してください。

水電解の半反応式は酸性条件の形式的表記です。電解液の詳細や副反応は扱いません。電流・時間の非零積が数値範囲を下回る場合は明示的に拒否します。
