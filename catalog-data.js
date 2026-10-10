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
        }
      ]
    },
    {
      id: 'physics',
      title: '物理',
      description: '運動や力、エネルギーの関係を視覚的に学ぶ。',
      path: 'subjects/physics/index.html',
      materials: []
    },
    {
      id: 'chemistry',
      title: '化学',
      description: '物質の性質や反応のしくみを理解する。',
      path: 'subjects/chemistry/index.html',
      materials: []
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
