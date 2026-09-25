import { defineQuestion } from '@rm/content/define'

export default defineQuestion({
  type: 'code',
  title: 'Koşullu Hook’u düzelt',
  difficulty: 'orta',
  concepts: ['tooling.eslint', 'react.useEffect', 'react.conditional-rendering'],
  files: ['hookSource.ts'],
  hints: [
    'Hook bazı render’larda hiç çağrılmıyor; erken dönüşe bak.',
    'Hook çağrısını dönüşten önceye taşı, koşulu effect içine koy.',
    '`useEffect(() => { if (id) document.title = id }, [id])` biçimini dene.',
  ],
})
