# 電池・標準電極電位

化学 · 電池。`index.html`を化学カタログから開きます。負極金属・標準/Nernst条件・濃度を変更し、電子移動を再生します。

## モデル・仮定・例外

放電中、酸化が起こる負極から還元が起こる正極へ外部回路の電子が流れます。慣用電流の向きは逆です。Znの標準還元電位−0.76 V、Cuの+0.34 Vから約1.10 Vです。Fe²⁺/Feは−0.44 V、Mg²⁺/Mgは−2.37 Vの代表値。標準状態では濃度欄を使いません。発展モードは25℃のNernst式、活動度≈濃度/標準濃度で、0を対数に代入しません。塩橋は陰イオンが酸化側、陽イオンが還元側へ移動し電気的中性を保つ模式表示です。

E^\circ_{\rm cell}=E^\circ_{\rm cathode}-E^\circ_{\rm anode} / E=E^\circ-\frac{RT}{2F}\ln Q,\quad Q=\frac{a(\mathrm M^{2+})}{a(\mathrm{Cu}^{2+})} / \mathrm{Zn}+\mathrm{Cu}^{2+}\to\mathrm{Zn}^{2+}+\mathrm{Cu}

データ・出典：高校用標準還元電位の代表値（SHE基準、25℃）：Zn −0.76、Cu +0.34、Fe −0.44、Mg −2.37 V。

模式図は実測画像や実験手順ではありません。入力は表示目的で丸めず、有限値・範囲を検証します。無効入力では直前の有効な状態を保ちます。表示は既存NumberDisplayの最大3桁と指数表記、数式は標準KaTeX 0.19.0（新しい拡張・CDNなし）です。

## 構成・検証・改良箇所

engine.jsはDOM非依存の計算とローカルデータ、tests.jsは化学・物質収支・境界の独立検証、drawing.jsは教材固有のSVG、script.jsは状態と操作です。説明・表示の変更はindex.html/style.css、数値モデルの変更はengine.js/tests.js、ラベルと図形の調整はdrawing.jsから行います。化学教材の入力・SVG基本部品のみ../shared/を再利用します。既存数学・物理を変更しません。

ルートで `node subjects/chemistry/galvanic_cell/tests.js`、全体は `python3 scripts/verify.py`。安全なプレビューと未追跡ファイルの追加はscripts/README.mdに従います。ブラウザ検証結果は全体の作業報告を参照してください。実機・Safari・Windowsの動作は別途確認が必要です。

## 実行した検証

Node独立テストと動的KaTeX検証：成功（PASS 4、FAIL 0）。実Chromiumで1366・820・390pxを確認し、全選択肢、主要入力、リセット、該当する再生停止・タッチ視点操作を全体テストで確認しました。実機iPad/スマートフォン、Safari/Firefox/Edge、Windowsでの実行は未検証です。Windowsの全体検証は `python scripts/verify.py` を使用してください。
