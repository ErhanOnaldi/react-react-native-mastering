import { defineQuestion } from '@rm/content/define'

export default defineQuestion({
  type: 'code',
  title: 'Koşullu Hook’u düzelt',
  difficulty: 'orta',
  concepts: ['tooling.eslint', 'react.useEffect', 'react.conditional-rendering'],
  files: ['hookSource.ts'],
  hints: [
    'Bileşenin iki durumunu korurken React Hook çağrısının iki render’da da yapıldığından emin ol.',
    '`react-hooks/rules-of-hooks` Hook’ların koşul ve erken dönüş içindeki çağrılarını denetler.',
    "`useEffect(() => { if (id) document.title = id }, [id])` biçiminde effect'i her dönüşten önce çağır.",
  ],
})
