import { defineQuestion } from '@rm/content/define'
export default defineQuestion({
  type: 'quiz',
  title: 'Context neyi çözer?',
  difficulty: 'kolay',
  concepts: ['react.context', 'react.composition'],
  question: 'Favori bilgisi dört aracı bileşenden geçiyor. Context’in gerçek etkisi nedir?',
  options: [
    {
      text: 'Tüketiciler değeri doğrudan okuyabilir; değer değişince onlar render olur.',
      correct: true,
      explanation: 'Prop aktarımını azaltır ama tüketici güncellemelerini yok etmez.',
    },
    {
      text: 'Tüm tüketiciler sonsuza kadar memoize edilir.',
      explanation: 'Context değeri değişince tüketiciler güncellenebilir.',
    },
    {
      text: 'Sunucu isteklerini otomatik cache’ler.',
      explanation: 'Context veri taşıma aracıdır; fetch cache’i sağlamaz.',
    },
  ],
})
