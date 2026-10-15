# mol・アボガドロ定数・反応量論

化学基礎 · 物質量。`index.html`を化学カタログから開きます。換算元とモル質量、2反応物のmolを変更します。棒グラフは反応係数比と余剰を示します。

## モデル・仮定・例外

1 molは定義されたアボガドロ定数個の粒子を含む物質量です。モル質量は原子量・同位体組成に基づく代表値で、定義定数と区別します。換算元は選択中の単位だけを使い、粒子数・mol・質量を同じ量として混同しません。反応係数は粒子数とmol比を表します。正の反応物係数で割った物質量の最小値が反応進行度です。2 molのH₂と1 molのO₂から最大2 molのH₂O、1 molのH₂と1 molのO₂ならO₂が0.5 mol余ります。反応が完全に進む理想量論で、収率や速度は扱いません。

N=nN_A,\quad m=nM,\quad N_A=6.02214076\times10^{23}\,\mathrm{mol^{-1}} / 2\mathrm H_2+\mathrm O_2\to2\mathrm H_2\mathrm O / \mathrm N_2+3\mathrm H_2\to2\mathrm{NH_3} / \xi=\min_i\frac{n_i}{\nu_i}

データ・出典：N_A：SI定義値（BIPM SI Brochure）。モル質量は教育用代表値（H 1.008、O 15.999、N 14.007 g/mol）。

模式図は実測画像や実験手順ではありません。入力は表示目的で丸めず、有限値・範囲を検証します。無効入力では直前の有効な状態を保ちます。表示は既存NumberDisplayの最大3桁と指数表記、数式は標準KaTeX 0.19.0（新しい拡張・CDNなし）です。

## 構成・検証・改良箇所

engine.jsはDOM非依存の計算とローカルデータ、tests.jsは化学・物質収支・境界の独立検証、drawing.jsは教材固有のSVG、script.jsは状態と操作です。説明・表示の変更はindex.html/style.css、数値モデルの変更はengine.js/tests.js、ラベルと図形の調整はdrawing.jsから行います。化学教材の入力・SVG基本部品のみ../shared/を再利用します。既存数学・物理を変更しません。

ルートで `node subjects/chemistry/mole_stoichiometry/tests.js`、全体は `python3 scripts/verify.py`。安全なプレビューと未追跡ファイルの追加はscripts/README.mdに従います。ブラウザ検証結果は全体の作業報告を参照してください。実機・Safari・Windowsの動作は別途確認が必要です。

## 実行した検証

Node独立テストと動的KaTeX検証：成功（PASS 6、FAIL 0）。実Chromiumで1366・820・390pxを確認し、全選択肢、主要入力、リセット、該当する再生停止・タッチ視点操作を全体テストで確認しました。実機iPad/スマートフォン、Safari/Firefox/Edge、Windowsでの実行は未検証です。Windowsの全体検証は `python scripts/verify.py` を使用してください。

粒子数を換算元とする入力は整数です。数値表現範囲外の換算を0として表示しません。
