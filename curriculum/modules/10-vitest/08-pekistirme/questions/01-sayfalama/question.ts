import { defineQuestion } from '@rm/content/define'

export default defineQuestion({
  type: 'code',
  title: 'Sayfalama sınırlarını koru',
  difficulty: 'orta',
  concepts: ['test.each', 'test.matchers', 'fetch.query-params'],
  files: ['pageSlice.test.ts'],
  hints: [
    'Hangi yanlış sayfa diliminin kullanıcıya benzer uzunlukta sonuç verebileceğini düşün.',
    'İkinci sayfanın ilk öğesini ve son sayfanın uzunluğunu sınayan veri kur.',
    '`pageSlice(items, page, 20)` için 41 id kullan; istersen `it.each` ile sayfaları ayır.',
    'Sayfa 2 ilk id 21, sayfa 3 tek id 41 olmalı.',
  ],
  testWriting: {
    mutants: [
      { id: 'zero-based', label: 'sayfa numarasını sıfırdan başlatan sürüm' },
      { id: 'full-only', label: 'kısmi son sayfayı göstermeyen sürüm' },
    ],
  },
})
