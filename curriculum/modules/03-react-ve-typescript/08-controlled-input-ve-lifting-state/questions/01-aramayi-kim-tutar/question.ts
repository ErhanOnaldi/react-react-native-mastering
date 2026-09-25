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
      text: 'İki bileşende ayrı ayrı',
      correct: false,
      explanation: 'İki state kolayca ayrışır ve senkronizasyon ister.',
    },
    {
      text: 'Her film nesnesinde',
      correct: false,
      explanation: 'Sorgu film verisinin değil, ekran etkileşiminin durumudur.',
    },
  ],
})
