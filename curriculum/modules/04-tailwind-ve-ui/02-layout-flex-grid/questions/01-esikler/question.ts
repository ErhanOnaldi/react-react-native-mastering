import { defineQuestion } from '@rm/content/define'

export default defineQuestion({
  type: 'quiz',
  title: 'Responsive ızgarayı oku',
  difficulty: 'kolay',
  concepts: ['tailwind.layout', 'tailwind.responsive'],
  question:
    '`grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4` için dar viewport ve `lg` eşiği sonrası kaç sütun oluşur?',
  options: [
    {
      text: 'Önce 2, sonra 4',
      correct: true,
      explanation: 'Öneksiz iki sütun temel düzendir; `lg:` eşiğinden itibaren dört sütun uygular.',
    },
    {
      text: 'Önce 3, sonra 4',
      correct: false,
      explanation: '`sm:` küçük telefon demek değildir; o genişlik eşiğinden itibaren geçerlidir.',
    },
    {
      text: 'Her zaman 2; sınıfların sırası değişmez',
      correct: false,
      explanation:
        'Responsive varyantlar medya koşullarına bağlıdır, statik class sırası sayılmaz.',
    },
  ],
})
