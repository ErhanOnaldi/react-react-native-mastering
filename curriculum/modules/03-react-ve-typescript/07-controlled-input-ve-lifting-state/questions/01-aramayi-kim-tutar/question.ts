import { defineQuestion } from '@rm/content/define'

export default defineQuestion({
  type: 'quiz',
  title: 'Aramayı kim tutar?',
  difficulty: 'kolay',
  concepts: ['react.lifting-state'],
  question: 'SearchBox ve MovieGrid aynı sorguya ihtiyaç duyuyor. State için en uygun yer neresi?',
  options: [
    {
      text: 'İkisinin ortak üst bileşeni',
      correct: true,
      explanation: 'Tek kaynak olur ve iki çocuk props üzerinden aynı değeri görür.',
    },
    {
      text: 'Yalnız SearchBox içinde',
      correct: false,
      explanation: 'Kutudaki yazı değişir ama MovieGrid sorguya erişemediği için liste süzülemez.',
    },
    {
      text: 'Yalnız MovieGrid içinde',
      correct: false,
      explanation:
        'Liste süzülür ama SearchBox üst bileşenden yeni değeri alamaz; iki görünümün ortak sahibi gerekir.',
    },
  ],
})
