import { defineQuestion } from '@rm/content/define'

export default defineQuestion({
  type: 'code',
  title: 'renderHook ile favori davranışını sına',
  difficulty: 'orta',
  concepts: ['test.render-hook', 'react.custom-hooks', 'react.immutability'],
  files: ['useFavoriteIds.test.ts'],
  hints: [
    'Hook’un başlangıç listesini ve bir id için beklenen iki ardışık geçişi belirle.',
    '`renderHook`, `result.current` ve `act` ile React render’ları içinde test et.',
    'Boş listeyi doğrula; `act` içinde aynı id’yi iki kez toggle edip `[550]` ve sonra `[]` bekle.',
  ],
  testWriting: {
    mutants: [
      { id: 'duplicates', label: 'aynı filmi tekrar ekleyen sürüm' },
      { id: 'no-remove', label: 'favoriyi çıkaramayan sürüm' },
    ],
  },
})
