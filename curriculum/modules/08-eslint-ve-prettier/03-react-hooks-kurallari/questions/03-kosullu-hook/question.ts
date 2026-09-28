import { defineQuestion } from '@rm/content/define'

export default defineQuestion({
  type: 'code',
  title: 'Koşullu Hook’u düzelt',
  difficulty: 'orta',
  concepts: ['tooling.eslint', 'react.useEffect', 'react.conditional-rendering'],
  files: ['hookSource.ts'],
  hints: [
    'İki render’ı karşılaştır: `id` yokken ve varken kaç Hook çağrısı oluyor?',
    '`react-hooks/rules-of-hooks` Hook’ların koşul ve erken dönüş içindeki çağrılarını denetler.',
    '`useEffect(() => { if (id) document.title = id }, [id])` biçiminde Hook’u üst seviyede tut ve işi içeride koşullandır.',
  ],
})
