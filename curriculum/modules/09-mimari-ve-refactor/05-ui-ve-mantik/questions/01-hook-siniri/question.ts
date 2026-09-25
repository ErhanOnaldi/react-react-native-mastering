import { defineQuestion } from '@rm/content/define'

export default defineQuestion({
  type: 'quiz',
  title: 'Hook neyi taşımalı?',
  difficulty: 'orta',
  concepts: ['arch.separation-of-concerns', 'react.custom-hooks', 'react.derived-state'],
  question: 'SearchPage 300 satır. Hangisini custom hook’a taşımak anlamlı?',
  options: [
    {
      text: 'Sorguya göre istek ve loading/error durumunu',
      correct: true,
      explanation: 'Doğru. Bu tekrar kullanılan davranış; görünüm sayfada kalabilir.',
    },
    {
      text: 'Bütün JSX ağacını',
      explanation: 'JSX’i hook içine saklamak görünüm sınırını belirsizleştirir.',
    },
    {
      text: 'Sadece `movies.length` değerini state ve effect ile',
      explanation: 'Uzunluk listeden türetilir; ayrı state/effect senkronizasyon hatası yaratır.',
    },
    { text: 'CSS class adlarını', explanation: 'Stil değerleri veri çekme davranışı değildir.' },
  ],
})
