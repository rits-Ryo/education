# 溶解度積と沈殿生成

化学 · 溶解平衡。`index.html`を化学カタログから開きます。初期濃度・Ksp・共通イオンを操作します。共通イオン溶解度は別条件です。

## モデル・仮定・例外

1:1塩AB（AgCl型）の濃度近似です。Qsp&gt;Kspなら沈殿方向に進み得ますが速度・核生成は扱いません。初期Ksp=1.8×10⁻¹⁰は教育用代表値で精密予測ではありません。沈殿量xを表示する場合は初濃度から同量を引く物質収支と平衡式を解きます。未飽和系に固体を勝手に追加しません。共通イオン下の溶解度は別の固体存在モデルでs(s+c)=Kspを解きます。体積1 Lに換算した沈殿molを表示します。

\mathrm{AB(s)}\rightleftharpoons\mathrm A^++\mathrm B^-,\quad Q_{sp}=[\mathrm A^+][\mathrm B^-] / s_{\rm pure}=\sqrt{K_{sp}},\quad([A]_0-x)([B]_0-x)=K_{sp}

データ・出典：教科書範囲の関係式による教育用モデル。実測データではありません。

模式図は実測画像や実験手順ではありません。入力は表示目的で丸めず、有限値・範囲を検証します。無効入力では直前の有効な状態を保ちます。表示は既存NumberDisplayの最大3桁と指数表記、数式は標準KaTeX 0.19.0（新しい拡張・CDNなし）です。

## 構成・検証・改良箇所

engine.jsはDOM非依存の計算とローカルデータ、tests.jsは化学・物質収支・境界の独立検証、drawing.jsは教材固有のSVG、script.jsは状態と操作です。説明・表示の変更はindex.html/style.css、数値モデルの変更はengine.js/tests.js、ラベルと図形の調整はdrawing.jsから行います。化学教材の入力・SVG基本部品のみ../shared/を再利用します。既存数学・物理を変更しません。

ルートで `node subjects/chemistry/solubility_product/tests.js`、全体は `python3 scripts/verify.py`。安全なプレビューと未追跡ファイルの追加はscripts/README.mdに従います。ブラウザ検証結果は全体の作業報告を参照してください。実機・Safari・Windowsの動作は別途確認が必要です。

## 実行した検証

Node独立テストと動的KaTeX検証：成功（PASS 5、FAIL 0）。実Chromiumで1366・820・390pxを確認し、全選択肢、主要入力、リセット、該当する再生停止・タッチ視点操作を全体テストで確認しました。実機iPad/スマートフォン、Safari/Firefox/Edge、Windowsでの実行は未検証です。Windowsの全体検証は `python scripts/verify.py` を使用してください。
