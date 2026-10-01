import { defineQuestion } from '@rm/content/define'

export default defineQuestion({
  type: 'quiz',
  title: 'Responsive ızgarayı oku',
  difficulty: 'kolay',
  concepts: ['tailwind.layout', 'tailwind.responsive'],
  question:
    'Pencere genişliği `lg` eşiğini geçince aşağıdaki bölüm kaç sütun kullanır? `grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4`',
  options: [
    {
      text: 'Dar görünümde 2, `lg` eşiğinden itibaren 4',
      correct: true,
      explanation: 'Öneksiz iki sütun temel düzendir; `lg:` eşiğinden itibaren dört sütun uygular.',
    },
    {
      text: 'Dar görünümde 3, `lg` eşiğinden itibaren 4',
      correct: false,
      explanation:
        'Öneksiz `grid-cols-2` dar görünümde geçerlidir; `sm:` kuralı ancak kendi eşiğine ulaşınca devreye girer.',
    },
    {
      text: 'Her zaman 4; son class tüm ekranlarda geçerlidir',
      correct: false,
      explanation:
        '`lg:` öneki kuralı geniş viewport eşiğine bağlar; class dizisinin sonda olması onu her ekrana uygulamaz.',
    },
  ],
})
