import { defineQuestion } from '@rm/content/define'

export default defineQuestion({
  type: 'quiz',
  title: 'Çift sayılar',
  difficulty: 'kolay',
  concepts: ['mini.sum'],
  mode: 'multiple',
  question: 'Hangileri çift sayıdır?',
  options: [
    { text: '2', correct: true, explanation: '2 çifttir.' },
    { text: '3', explanation: '3 tektir.' },
    { text: '4', correct: true, explanation: '4 çifttir.' },
  ],
})
