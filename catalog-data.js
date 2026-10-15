// Public catalog only. Paths are relative to the repository root.
// Add a material here to update both the entrance and subject pages.
window.educationCatalog = {
  subjects: [
    {
      id: 'math',
      title: '数学',
      description: 'グラフや式を動かしながら、数学のしくみを理解する。',
      path: 'subjects/math/index.html',
      materials: [
        {
          id: 'quadratic-max-min',
          title: '2次関数の最大・最小',
          category: '数学Ⅰ · 二次関数',
          description: '頂点や定義域を動かして、最大・最小と場合分けを確かめよう。',
          path: 'subjects/math/Quadratic_function/max_min.html',
          tags: ['平方完成', 'パラメータ操作', '境界の比較']
        },
        {
          id: 'factoring-expansion-formulas',
          title: '因数分解・展開の公式',
          category: '数学Ⅰ・Ⅱ · 式の計算',
          description: '基本公式から三乗・立方和と差まで、式の導出を確認しながら整理しよう。',
          path: 'subjects/math/factoring_and_expansion_formulas/factoring_and_expansion_formulas.html',
          tags: ['公式一覧', '導出の表示', '計算例']
        },
        {
          id: 'derangement',
          title: '完全順列',
          category: '数学A · 場合の数',
          description: '公式の証明と具体例から、全員が元と違う位置にいる並べ方を数えよう。',
          path: 'subjects/math/derangement/index.html',
          tags: ['包除原理', '漸化式', '例題と解説']
        },
        {
          id: 'trigonometric-functions',
          title: '単位円と三角関数',
          category: '数学Ⅱ · 三角関数',
          description: '単位円の座標とグラフを連動させ、弧度法・周期性・グラフの変形を理解する。',
          path: 'subjects/math/trigonometric_functions/index.html',
          tags: ['単位円の操作', '角度のアニメーション', 'グラフの変形']
        },
        {
          id: 'differentiation',
          title: '微分 — 接線の傾きと導関数',
          category: '数学Ⅱ・Ⅲ · 微分法',
          description: '割線から接線へ、接線の傾きから導関数へ。図を動かして増減・極値とのつながりを理解する。',
          path: 'subjects/math/differentiation/index.html',
          tags: ['割線と接線', '導関数の連動', '増減と極値']
        },
        {
          id: 'integration',
          title: '定積分と面積・区分求積法',
          category: '数学Ⅱ・Ⅲ · 積分法',
          description: '長方形の個数を増やして曲線の領域を近似し、面積の和・Σ・極限と定積分を結ぶ。',
          path: 'subjects/math/integration/index.html',
          tags: ['長方形の近似', '符号付き面積', 'Σと極限']
        },
        {
          id: 'vectors-inner-product',
          title: 'ベクトルと内積 — なす角と正射影の可視化',
          category: '数学C · 平面ベクトル',
          description: '2つのベクトルを動かしながら、なす角・正射影・内積の関係を理解する。',
          path: 'subjects/math/vectors_inner_product/index.html',
          tags: ['ベクトルの操作', '正射影', '内積と直交']
        },
        {
          "id": "quadratic-inequalities",
          "title": "二次不等式とグラフの符号",
          "category": "数学Ⅰ · 二次不等式",
          "description": "放物線の符号と実根、不等号に応じた解集合を数直線で結ぶ。",
          "path": "subjects/math/quadratic_inequalities/index.html",
          "tags": [
            "判別式",
            "解集合",
            "符号区間"
          ]
        },
        {
          "id": "triangle-theorems",
          "title": "三角形と正弦定理・余弦定理",
          "category": "数学Ⅰ · 図形と計量",
          "description": "三角形の頂点を動かし、辺・角・面積と外接円を連動させる。",
          "path": "subjects/math/triangle_theorems/index.html",
          "tags": [
            "頂点ドラッグ",
            "正弦定理",
            "外接円"
          ]
        },
        {
          "id": "probability-simulation",
          "title": "確率の試行と相対度数",
          "category": "数学A · 確率",
          "description": "シード付き試行で理論確率と相対度数の変動を可視化する。",
          "path": "subjects/math/probability_simulation/index.html",
          "tags": [
            "相対度数",
            "再現シード",
            "疑似乱数"
          ]
        },
        {
          "id": "sequences-recursion",
          "title": "数列と漸化式",
          "category": "数学B · 数列",
          "description": "等差・等比・一次漸化式の項と一般項、不動点を描く。",
          "path": "subjects/math/sequences_recursion/index.html",
          "tags": [
            "一般項",
            "符号交代",
            "不動点"
          ]
        },
        {
          "id": "binomial-distribution",
          "title": "二項分布と期待値・分散",
          "category": "数学B · 確率分布",
          "description": "独立試行の理論分布と累積確率、期待値・分散を表示する。",
          "path": "subjects/math/binomial_distribution/index.html",
          "tags": [
            "理論分布",
            "累積確率",
            "期待値と分散"
          ]
        },
        {
          "id": "exponential-logarithmic",
          "title": "指数関数と対数関数・逆関数",
          "category": "数学Ⅱ · 指数・対数",
          "description": "指数・対数の対応点を直線y=xに関する反射で結ぶ。",
          "path": "subjects/math/exponential_logarithmic/index.html",
          "tags": [
            "逆関数",
            "対応点",
            "底の操作"
          ]
        },
        {
          "id": "circle-and-line",
          "title": "円と直線の位置関係",
          "category": "数学Ⅱ · 図形と方程式",
          "description": "円と直線の距離から交点・接線・共有点なしを可視化する。",
          "path": "subjects/math/circle_and_line/index.html",
          "tags": [
            "交点",
            "接線",
            "垂線の足"
          ]
        },
        {
          "id": "complex-plane",
          "title": "複素数平面と回転・乗算",
          "category": "数学C · 複素数平面",
          "description": "複素数の積を伸縮と回転として成分・偏角と結ぶ。",
          "path": "subjects/math/complex_plane/index.html",
          "tags": [
            "伸縮と回転",
            "成分の操作",
            "偏角"
          ]
        },
        {
          "id": "spatial-vectors",
          "title": "空間ベクトルと内積・位置関係",
          "category": "数学C · 空間ベクトル",
          "description": "視点を回しながら3次元の成分・内積・実角度を表示する。",
          "path": "subjects/math/spatial_vectors/index.html",
          "tags": [
            "視点の回転",
            "3次元の内積",
            "零ベクトル"
          ]
        },
        {
          "id": "limits-and-continuity",
          "title": "関数の極限と連続性",
          "category": "数学Ⅲ · 極限への導入",
          "description": "左右の接近と穴・関数値を描き、極限と連続を区別する。",
          "path": "subjects/math/limits_and_continuity/index.html",
          "tags": [
            "左右の極限",
            "関数の穴",
            "連続性"
          ]
        }
      ]
    },
    {
      id: 'physics',
      title: '物理',
      description: '運動や力、エネルギーの関係を視覚的に学ぶ。',
      path: 'subjects/physics/index.html',
      materials: [
        {
          id: 'kinematics',
          title: '等加速度直線運動',
          category: '物理基礎 · 運動',
          description: '位置・速度・加速度のグラフを連動させ、傾きと符号付き面積の意味を理解する。',
          path: 'subjects/physics/kinematics/index.html',
          tags: ['3グラフの連動', '符号付き面積', '運動の再生']
        },
        {
          id: 'wave-interference',
          title: '波の重ね合わせと干渉',
          category: '物理 · 波動',
          description: '2つの波源と観測点を動かし、経路差・位相差・合成振幅を結ぶ。',
          path: 'subjects/physics/wave_interference/index.html',
          tags: ['波面の再生', '観測点の操作', '位相と干渉']
        },
        {
          id: 'electric-field-potential',
          title: '電場と電位',
          category: '物理 · 電気',
          description: '点電荷を動かして、電場ベクトル・電気力線・等電位線の関係を観察する。',
          path: 'subjects/physics/electric_field_potential/index.html',
          tags: ['電荷の操作', '電気力線', '等電位線']
        }
      ]
    },
    {
      id: 'chemistry',
      title: '化学',
      description: '物質の性質や反応のしくみを理解する。',
      path: 'subjects/chemistry/index.html',
      materials: [
        {
                "id": "atomic-structure",
                "title": "原子の構造と電子配置",
                "category": "化学基礎 · 物質の構成",
                "description": "粒子数と殻配置を原子番号・同位体・電荷から結ぶ。",
                "path": "subjects/chemistry/atomic_structure/index.html",
                "tags": [
                        "同位体",
                        "イオン",
                        "電子配置"
                ]
        },
        {
                "id": "periodic-trends",
                "title": "周期表と元素の周期性",
                "category": "化学基礎 · 周期表",
                "description": "元素1〜36の族・周期・電子配置と周期性を比較する。",
                "path": "subjects/chemistry/periodic_trends/index.html",
                "tags": [
                        "周期表",
                        "価電子",
                        "電気陰性度"
                ]
        },
        {
                "id": "bonding-molecular-geometry",
                "title": "化学結合と分子の形",
                "category": "化学基礎・化学 · 結合",
                "description": "ルイス式と空間模型を切り替え、分子を回転する。",
                "path": "subjects/chemistry/bonding_molecular_geometry/index.html",
                "tags": [
                        "孤立電子対",
                        "結合角",
                        "極性"
                ]
        },
        {
                "id": "mole-stoichiometry",
                "title": "mol・アボガドロ定数・反応量論",
                "category": "化学基礎 · 物質量",
                "description": "粒子数・mol・質量と限量反応物・余剰を結ぶ。",
                "path": "subjects/chemistry/mole_stoichiometry/index.html",
                "tags": [
                        "物質量",
                        "係数比",
                        "限量反応物"
                ]
        },
        {
                "id": "solution-concentration",
                "title": "溶液の濃度・希釈・混合",
                "category": "化学基礎 · 溶液",
                "description": "単位換算・希釈・混合を溶質の保存から計算する。",
                "path": "subjects/chemistry/solution_concentration/index.html",
                "tags": [
                        "希釈",
                        "混合",
                        "単位換算"
                ]
        },
        {
                "id": "gas-laws",
                "title": "気体の状態方程式と気体法則",
                "category": "化学 · 気体",
                "description": "固定条件を選び、理想気体のグラフと粒子模型を連動させる。",
                "path": "subjects/chemistry/gas_laws/index.html",
                "tags": [
                        "気体法則",
                        "固定条件",
                        "絶対温度"
                ]
        },
        {
                "id": "phase-diagram",
                "title": "状態変化・相図・蒸気圧",
                "category": "化学基礎・化学 · 状態",
                "description": "潜熱の温度停滞と、相図の共存領域を可視化する。",
                "path": "subjects/chemistry/phase_diagram/index.html",
                "tags": [
                        "加熱曲線",
                        "潜熱",
                        "相境界"
                ]
        },
        {
                "id": "thermochemistry",
                "title": "反応熱・エンタルピー・ヘスの法則",
                "category": "化学 · 熱化学",
                "description": "反応の逆転・係数倍と、2経路のエンタルピー差を比較する。",
                "path": "subjects/chemistry/thermochemistry/index.html",
                "tags": [
                        "ヘスの法則",
                        "準位図",
                        "反応熱"
                ]
        },
        {
                "id": "reaction-kinetics",
                "title": "化学反応速度・活性化エネルギー",
                "category": "化学 · 反応速度",
                "description": "次数別の濃度曲線、温度と活性化エネルギーを結ぶ。",
                "path": "subjects/chemistry/reaction_kinetics/index.html",
                "tags": [
                        "反応次数",
                        "半減期",
                        "Arrhenius式"
                ]
        },
        {
                "id": "chemical-equilibrium",
                "title": "化学平衡・平衡定数と反応商",
                "category": "化学 · 化学平衡",
                "description": "濃度保存・QとK・正逆速度を動的平衡と対応させる。",
                "path": "subjects/chemistry/chemical_equilibrium/index.html",
                "tags": [
                        "反応商",
                        "動的平衡",
                        "濃度変化"
                ]
        },
        {
                "id": "le-chatelier",
                "title": "ルシャトリエの原理・平衡移動",
                "category": "化学 · 平衡移動",
                "description": "添加・体積・温度と、変更直後・新平衡を区別する。",
                "path": "subjects/chemistry/le_chatelier/index.html",
                "tags": [
                        "平衡移動",
                        "圧縮",
                        "温度とK"
                ]
        },
        {
                "id": "acid-base-ph",
                "title": "酸・塩基とpH",
                "category": "化学基礎 · 酸塩基",
                "description": "水の自己解離を含め、強酸・強塩基・純水・希釈を計算する。",
                "path": "subjects/chemistry/acid_base_ph/index.html",
                "tags": [
                        "pH",
                        "希釈",
                        "自己解離"
                ]
        },
        {
                "id": "acid-base-titration",
                "title": "中和滴定と滴定曲線",
                "category": "化学基礎・化学 · 中和滴定",
                "description": "当量点と指示薬域、全体積を使った滴定曲線を結ぶ。",
                "path": "subjects/chemistry/acid_base_titration/index.html",
                "tags": [
                        "当量点",
                        "滴定曲線",
                        "指示薬"
                ]
        },
        {
                "id": "buffer-solution",
                "title": "緩衝液とヘンダーソン・ハッセルバルヒの式",
                "category": "化学 · 酸塩基平衡",
                "description": "成分比と酸塩基添加、緩衝容量と近似の条件を示す。",
                "path": "subjects/chemistry/buffer_solution/index.html",
                "tags": [
                        "成分比",
                        "緩衝容量",
                        "近似の条件"
                ]
        },
        {
                "id": "solubility-product",
                "title": "溶解度積と沈殿生成",
                "category": "化学 · 溶解平衡",
                "description": "イオン積とKsp、沈殿の物質収支と共通イオン効果を結ぶ。",
                "path": "subjects/chemistry/solubility_product/index.html",
                "tags": [
                        "沈殿",
                        "溶解度",
                        "共通イオン"
                ]
        },
        {
                "id": "oxidation-reduction",
                "title": "酸化還元と酸化数",
                "category": "化学基礎 · 酸化還元",
                "description": "酸化数・電子授受・係数倍と電荷保存を対応させる。",
                "path": "subjects/chemistry/oxidation_reduction/index.html",
                "tags": [
                        "酸化数",
                        "半反応式",
                        "電子授受"
                ]
        },
        {
                "id": "galvanic-cell",
                "title": "電池・標準電極電位",
                "category": "化学 · 電池",
                "description": "電極の正負と電子流、標準起電力・Nernst近似を示す。",
                "path": "subjects/chemistry/galvanic_cell/index.html",
                "tags": [
                        "ダニエル電池",
                        "起電力",
                        "電極電位"
                ]
        },
        {
                "id": "electrolysis-faraday",
                "title": "電気分解とファラデーの法則",
                "category": "化学 · 電気分解",
                "description": "電流と時間から電子mol・析出量・気体比を計算する。",
                "path": "subjects/chemistry/electrolysis_faraday/index.html",
                "tags": [
                        "電荷量",
                        "銅析出",
                        "ファラデー則"
                ]
        },
        {
                "id": "crystal-lattices",
                "title": "結晶構造・単位格子",
                "category": "化学 · 固体構造",
                "description": "共有原子の寄与と原子数、配位数・充填率を回転模型で示す。",
                "path": "subjects/chemistry/crystal_lattices/index.html",
                "tags": [
                        "単位格子",
                        "配位数",
                        "充填率"
                ]
        },
        {
                "id": "organic-isomerism",
                "title": "有機化合物の構造と異性体",
                "category": "化学 · 有機化学",
                "description": "分子式が同じ構造を、官能基・骨格・模型で比較する。",
                "path": "subjects/chemistry/organic_isomerism/index.html",
                "tags": [
                        "構造異性体",
                        "官能基",
                        "原子価"
                ]
        }
]
    },
    {
      id: 'english',
      title: '英語',
      description: '言葉のしくみや使い方を学ぶ。',
      path: 'subjects/english/index.html',
      materials: []
    }
  ]
};
