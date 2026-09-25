import { defineQuestion } from '@rm/content/define'

export default defineQuestion({
  type: 'code',
  title: 'Sayıdan kategori çıkar',
  difficulty: 'kolay',
  concepts: ['ts.primitives', 'ts.inference'],
  files: ['scoreBand.ts'],
  hints: [
    'Önce 0 değerini ayrı ele al.',
    '8 sınırını `>=` ile test et.',
    'Kalan tüm sayılar için `normal` döndür.',
  ],
})
