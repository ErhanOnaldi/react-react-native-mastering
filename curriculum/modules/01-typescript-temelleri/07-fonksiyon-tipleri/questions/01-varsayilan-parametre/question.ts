import { defineQuestion } from '@rm/content/define'

export default defineQuestion({
  type: 'quiz',
  title: 'Varsayılan parametre',
  difficulty: 'kolay',
  concepts: ['ts.functions'],
  question:
    '`function label(vote: number, digits = 1)` çağrısında ikinci argüman verilmezse ne olur?',
  options: [
    {
      text: 'digits 1 olur.',
      correct: true,
      explanation: 'Varsayılan parametre eksik argümanı çalışma zamanında doldurur.',
    },
    {
      text: 'digits null olur.',
      explanation: 'Varsayılan ifade 1’dir; null ancak açıkça verilirse ayrı durumdur.',
    },
    {
      text: 'Fonksiyon çağrılamaz.',
      explanation: 'Varsayılan parametre bu argümanı çağıran için isteğe bağlı yapar.',
    },
  ],
})
