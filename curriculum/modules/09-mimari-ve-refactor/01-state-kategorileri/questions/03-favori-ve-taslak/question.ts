import { defineQuestion } from '@rm/content/define'

export default defineQuestion({
  type: 'quiz',
  title: 'Favori ile taslak',
  difficulty: 'orta',
  concepts: ['arch.state-categories', 'react.controlled-input', 'react.context'],
  question:
    'Kullanıcı bir filmi favoriye ekledi, sonra henüz göndermediği yorum formuna yazdı. Doğru eşleşme nedir?',
  options: [
    {
      text: 'Favori client, yorum taslağı form state',
      correct: true,
      explanation:
        'Doğru. Favori cihazdaki tercih; yazılan metin henüz gönderilmemiş form değeridir.',
    },
    {
      text: 'İkisi de server state',
      explanation:
        'TMDB verisi olabilir ama bu iki değer kullanıcı tarafından yerelde oluşturuldu.',
    },
    {
      text: 'İkisi de URL state',
      explanation: 'Bu değerler sayfa adresinin paylaşılabilir gezinme seçimi değildir.',
    },
    {
      text: 'Favori form, yorum URL state',
      explanation: 'Favori bir form alanı değil; yorum taslağını URL’ye yazmak gereksizdir.',
    },
  ],
})
