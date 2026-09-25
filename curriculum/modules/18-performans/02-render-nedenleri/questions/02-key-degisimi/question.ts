import { defineQuestion } from '@rm/content/define'

export default defineQuestion({
  type: 'quiz',
  title: 'Key ne yapar?',
  difficulty: 'kolay',
  concepts: ['react.lists-keys'],
  question: 'Bir film satırının key’i her aramada rastgele değişirse ne olur?',
  options: [
    {
      text: 'Satır yeniden oluşturulur ve yerel state kaybolabilir',
      correct: true,
      explanation: 'Key kimliktir; yeni key yeni bileşen demektir.',
    },
    {
      text: 'React daha iyi memoization yapar',
      correct: false,
      explanation: 'Kararsız kimlik tekrar kullanımı engeller.',
    },
    {
      text: 'Yalnız CSS değişir',
      correct: false,
      explanation: 'Key reconciliation davranışını etkiler.',
    },
  ],
})
