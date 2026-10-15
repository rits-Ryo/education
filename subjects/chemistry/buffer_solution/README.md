# 緩衝液とヘンダーソン・ハッセルバルヒの式

化学 · 酸塩基平衡。`index.html`を化学カタログから開きます。pKa・成分mol・体積・酸または塩基の添加量を変更します。

## モデル・仮定・例外

強酸はA⁻を消費してHAを増やし、強塩基は逆です。種類を一つだけ選び二重計上せず、両成分の合計molを保存します。HH式は両成分が十分存在し活量を濃度で近似できる条件の近似です。本教材は比0.1〜10、合計濃度がKaの100倍以上、容量未超過を適用条件とし、それ以外は範囲外です。枯渇後のpHをこの式で求めません。体積変化なし、pKaは教育用パラメータです。

\mathrm{pH}\approx\mathrm{p}K_a+\log_{10}\frac{[\mathrm A^-]}{[\mathrm{HA}]} / \mathrm A^-+\mathrm H^+\to\mathrm{HA},\quad\mathrm{HA}+\mathrm{OH}^-\to\mathrm A^-+\mathrm H_2\mathrm O

データ・出典：教科書範囲の関係式による教育用モデル。実測データではありません。

模式図は実測画像や実験手順ではありません。入力は表示目的で丸めず、有限値・範囲を検証します。無効入力では直前の有効な状態を保ちます。表示は既存NumberDisplayの最大3桁と指数表記、数式は標準KaTeX 0.19.0（新しい拡張・CDNなし）です。

## 構成・検証・改良箇所

engine.jsはDOM非依存の計算とローカルデータ、tests.jsは化学・物質収支・境界の独立検証、drawing.jsは教材固有のSVG、script.jsは状態と操作です。説明・表示の変更はindex.html/style.css、数値モデルの変更はengine.js/tests.js、ラベルと図形の調整はdrawing.jsから行います。化学教材の入力・SVG基本部品のみ../shared/を再利用します。既存数学・物理を変更しません。

ルートで `node subjects/chemistry/buffer_solution/tests.js`、全体は `python3 scripts/verify.py`。安全なプレビューと未追跡ファイルの追加はscripts/README.mdに従います。ブラウザ検証結果は全体の作業報告を参照してください。実機・Safari・Windowsの動作は別途確認が必要です。

## 実行した検証

Node独立テストと動的KaTeX検証：成功（PASS 4、FAIL 0）。実Chromiumで1366・820・390pxを確認し、全選択肢、主要入力、リセット、該当する再生停止・タッチ視点操作を全体テストで確認しました。実機iPad/スマートフォン、Safari/Firefox/Edge、Windowsでの実行は未検証です。Windowsの全体検証は `python scripts/verify.py` を使用してください。
