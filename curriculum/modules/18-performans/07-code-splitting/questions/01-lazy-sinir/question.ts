import { defineQuestion } from '@rm/content/define'

export default defineQuestion({
  type: 'quiz',
  title: 'Fallback ne zaman görünür?',
  difficulty: 'kolay',
  concepts: ['perf.code-splitting'],
  question: 'lazy ile detay bileşeni indiriliyor. Yükleme sırasında ne gerekir?',
  options: [
    {
      text: 'Suspense fallback',
      correct: true,
      explanation: 'lazy bileşen promise beklerken en yakın Suspense sınırı fallback gösterir.',
    },
    {
      text: 'useEffect içinde import',
      correct: false,
      explanation: 'lazy modül yüklemesini React ile yönetir.',
    },
    {
      text: 'Her render’da yeni lazy tanımı',
      correct: false,
      explanation: 'Yeni component tipi state sıfırlayabilir.',
    },
  ],
})
