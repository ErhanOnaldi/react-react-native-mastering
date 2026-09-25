import { defineQuestion } from '@rm/content/define'

export default defineQuestion({
  type: 'quiz',
  title: 'Başarı durumu',
  difficulty: 'kolay',
  concepts: ['ts.discriminated-union', 'ts.narrowing'],
  question: '`RemoteData<Movie>` değeri `status: "success"` iken hangi alan güvenle okunur?',
  options: [
    {
      text: '`data`',
      correct: true,
      explanation: 'Discriminant başarı dalını seçer; bu dalda data zorunludur.',
    },
    { text: '`error`', explanation: 'Hata mesajı yalnızca error dalında bulunur.' },
    {
      text: 'Her iki alan da opsiyoneldir.',
      explanation: 'Discriminated union her dalın alanlarını ayrı tanımlar.',
    },
  ],
})
