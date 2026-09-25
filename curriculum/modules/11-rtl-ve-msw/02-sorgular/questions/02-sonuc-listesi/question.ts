import { defineQuestion } from '@rm/content/define'

export default defineQuestion({
  type: 'code',
  title: 'Liste sorgularını test et',
  difficulty: 'orta',
  concepts: ['test.rtl-queries', 'react.conditional-rendering'],
  files: ['MovieResults.test.tsx'],
  hints: [
    'Farklı props ile iki ayrı render kur.',
    'Başlığı getByRole, yokluğu queryByRole ile sorgula.',
    'Boş listede status rolünü ve metni doğrula.',
  ],
  testWriting: {
    mutants: [
      { id: 'no-heading', label: 'film başlığını düz metne çeviren sürüm' },
      { id: 'wrong-empty', label: 'boş durumda yanlış mesaj veren sürüm' },
    ],
  },
})
