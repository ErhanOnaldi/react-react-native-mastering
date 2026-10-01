import { defineQuestion } from '@rm/content/define'
export default defineQuestion({
  type: 'quiz',
  title: 'Immer ve eski snapshot',
  difficulty: 'kolay',
  concepts: ['react.immutability'],
  question: 'Slice reducer’ında `state.ids.unshift(550)` kullandın. Doğru beklenti hangisi?',
  options: [
    {
      text: 'Immer yeni state üretir, eski state dizisi değişmez.',
      correct: true,
      explanation: 'Reducer’a verilen state draft’tır.',
    },
    {
      text: 'Eski dizi değişir; Redux yeni state’i action geçmişinde ayrıca saklar.',
      correct: false,
      explanation:
        'Reducer’a verilen state Immer draft’ıdır; önceki snapshot aynı değerleri korur.',
    },
    {
      text: 'Reducer `unshift` çağrısında hata verir; yalnız spread ile yeni dizi oluşturulabilir.',
      correct: false,
      explanation:
        'Slice reducer’ında draft üzerinde `unshift` gibi dizi güncellemeleri kullanılabilir.',
    },
  ],
})
