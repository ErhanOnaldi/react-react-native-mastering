import { defineQuestion } from '@rm/content/define'

export default defineQuestion({
  type: 'code',
  title: 'renderHook ile favori davranışını sına',
  difficulty: 'orta',
  concepts: ['test.render-hook', 'react.custom-hooks', 'react.immutability'],
  files: ['useFavoriteIds.test.ts'],
  hints: [
    'renderHook sonucunu result.current ile oku.',
    'State değiştiren çağrıyı act(() => ...) içine koy.',
    'Aynı id’yi iki kez toggle ederek hem ekleme hem çıkarma davranışını yakala.',
  ],
  testWriting: {
    mutants: [
      { id: 'duplicates', label: 'aynı filmi tekrar ekleyen sürüm' },
      { id: 'no-remove', label: 'favoriyi çıkaramayan sürüm' },
    ],
  },
})
