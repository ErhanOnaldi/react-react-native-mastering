import { defineQuestion } from '@rm/content/define'

export default defineQuestion({
  type: 'quiz',
  title: 'Çıkarılan tip',
  difficulty: 'kolay',
  concepts: ['ts.inference'],
  question: '`let vote = 8.4` sonrasında hangi atama typecheck’ten geçer?',
  options: [
    {
      text: '`vote = 9`',
      correct: true,
      explanation: 'Başlangıç değeri number olduğu için başka bir sayı atanabilir.',
    },
    { text: '`vote = "9"`', explanation: 'Metin sayı gibi görünse de string’dir.' },
    { text: '`vote = null`', explanation: 'Çıkarılan number tipi null içermez.' },
  ],
})
