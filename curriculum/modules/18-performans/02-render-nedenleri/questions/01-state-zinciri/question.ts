import { defineQuestion } from '@rm/content/define'

export default defineQuestion({
  type: 'quiz',
  title: 'Hangi ağaç çalışır?',
  difficulty: 'kolay',
  concepts: ['perf.rerender'],
  question: 'Arama state’i üst bileşende değişti. Varsayılan davranış nedir?',
  options: [
    {
      text: 'Üst bileşen ve çocukları yeniden çağrılabilir',
      correct: true,
      explanation: 'State güncellemesi bileşeni render eder; çocuklar varsayılan olarak çağrılır.',
    },
    {
      text: 'Yalnız input DOM düğümü render edilir',
      correct: false,
      explanation: 'Render bileşen çağrısıdır; DOM değişimiyle aynı şey değildir.',
    },
    {
      text: 'Bütün uygulama mutlaka DOM’u yeniler',
      correct: false,
      explanation: 'React aynı DOM’u koruyabilir.',
    },
  ],
})
