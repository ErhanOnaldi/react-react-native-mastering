import { defineQuestion } from '@rm/content/define'

export default defineQuestion({
  type: 'code',
  title: 'Bilinmeyen film özetini kontrol et',
  difficulty: 'orta',
  concepts: ['ts.type-guards', 'ts.unknown-any', 'ts.narrowing'],
  files: ['task.ts'],
  hints: [
    'Dış değeri kullanmadan önce hangi yapısal kontrollerin sırayla gerektiğini belirle.',
    'Nesne, null değil ve dizi değil koşullarından sonra `in` ve `typeof` kontrolleri yap.',
    'Kapak alanı için string ve null iki kabul edilen değerdir.',
  ],
})
