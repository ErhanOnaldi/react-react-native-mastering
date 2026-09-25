import { defineQuestion } from '@rm/content/define'

export default defineQuestion({
  type: 'quiz',
  title: 'Toplamın sonucu',
  difficulty: 'kolay',
  concepts: ['mini.sum'],
  question: '`1 + 1` kaçtır?',
  options: [
    { text: '`2`', correct: true, explanation: 'Doğru.' },
    { text: '`11`', explanation: 'Bu string birleştirme olurdu.' },
  ],
})
