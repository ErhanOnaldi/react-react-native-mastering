import { defineQuestion } from '@rm/content/define'

export default defineQuestion({
  type: 'code',
  title: 'sum için test yaz',
  difficulty: 'orta',
  concepts: ['mini.testing', 'mini.sum'],
  files: ['sum.test.ts'],
  testWriting: {
    mutants: [
      { id: 'ignores-b', label: 'ikinci sayıyı yok sayan versiyon' },
      { id: 'always-zero', label: 'her zaman 0 döndüren versiyon' },
    ],
  },
})
