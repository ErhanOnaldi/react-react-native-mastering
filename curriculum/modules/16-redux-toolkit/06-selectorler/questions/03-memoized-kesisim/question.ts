import { defineQuestion } from '@rm/content/define'
export default defineQuestion({
  type: 'code',
  title: 'Memoized favori kesişimi',
  difficulty: 'orta',
  concepts: ['redux.selectors', 'js.array-methods'],
  files: ['overlap.ts'],
  hints: [
    'İki input alanını seçen fonksiyonları ayrı tanımla; türetme yalnız bu iki değere bağlı olsun.',
    '`createSelector` ilk argümanda input selector dizisi, ikinci argümanda bu input değerlerini alan hesaplama fonksiyonu alır.',
    'Hesaplama fonksiyonunda seçili ID’leri sırayla dolaşıp favorilerde bulunanları tut; dönen selector’ı `selectOverlap` adıyla export et.',
  ],
})
