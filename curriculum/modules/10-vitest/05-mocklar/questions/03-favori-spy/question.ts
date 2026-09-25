import { defineQuestion } from '@rm/content/define'

export default defineQuestion({
  type: 'code',
  title: 'Favori kaydını spy ile test et',
  difficulty: 'orta',
  concepts: ['test.mocks', 'react.immutability', 'js.array-methods'],
  files: ['favoriteStore.test.ts'],
  hints: [
    'Depolamayı test başında temizle; `Storage.prototype` üzerindeki `setItem` metodunu izle.',
    '`vi.spyOn(Storage.prototype, "setItem")` ile yazılan anahtarı ve JSON verisini denetle.',
    'Aynı id’yi iki kez ekle; kaydedilen dizide tek kez bulunmalı.',
  ],
  testWriting: {
    mutants: [
      { id: 'wrong-key', label: 'favorileri başka bir anahtara kaydeden sürüm' },
      { id: 'duplicates', label: 'aynı filmi yeniden ekleyen sürüm' },
    ],
  },
})
