import { defineQuestion } from '@rm/content/define'

export default defineQuestion({
  type: 'code',
  title: 'Eksik id bağımlılığını düzelt',
  difficulty: 'orta',
  concepts: ['react.useEffect.deps', 'router.params', 'tooling.eslint'],
  files: ['detailsSource.ts'],
  hints: [
    'Effect’in dışındaki render değerlerini bul ve hangisi değişince başlık yenilenmeli diye sor.',
    '`react-hooks/exhaustive-deps` kuralı effect’in okuduğu reaktif değerlerle dependency array’i karşılaştırır.',
    'Bu bileşende `useEffect(..., [id])` biçimini kullan; `[]` bu prop değişimini izlemez.',
  ],
})
