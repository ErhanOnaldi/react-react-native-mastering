import { defineQuestion } from '@rm/content/define'

export default defineQuestion({
  type: 'quiz',
  title: 'Görünüm seçenekleri',
  difficulty: 'kolay',
  concepts: ['ts.literal'],
  question: 'Yalnızca grid ve list görünümünü kabul eden tip hangisi?',
  options: [
    {
      text: "`'grid' | 'list'`",
      correct: true,
      explanation: 'İki literal dışında değer kabul edilmez.',
    },
    { text: '`string`', explanation: 'Her metni kabul eder; yazım hatası yakalanmaz.' },
    { text: '`boolean`', explanation: 'İki olasılık olsa da anlamlı string değerlerini taşımaz.' },
  ],
})
