import { defineQuestion } from '@rm/content/define'

export default defineQuestion({
  type: 'quiz',
  title: 'Variant anahtarını tek kaynaktan al',
  difficulty: 'orta',
  concepts: ['ts.keyof-typeof', 'tailwind.cva'],
  question:
    'Modül 2’de `keyof typeof` ile config anahtarlarını çıkarmıştın. Kopyaladığın UI bileşeninde `const variants = { primary: "...", subtle: "...", danger: "..." }` var. `ButtonVariant` tipi yeni varyant eklendiğinde nasıl güncel kalır?',
  options: [
    {
      text: '`type ButtonVariant = keyof typeof variants`',
      correct: true,
      explanation:
        'Doğru. Nesnenin anahtarları tipin kaynağı olur; `danger` dahil yeni anahtarlar otomatik görünür.',
    },
    {
      text: '`type ButtonVariant = typeof variants`',
      correct: false,
      explanation: 'Bu nesne şeklidir; varyant adı union’ı değildir.',
    },
    {
      text: '`type ButtonVariant = "primary" | "subtle"`',
      correct: false,
      explanation:
        'Elle yazılan union yeni `danger` varyantını kaçırır ve iki kaynak birbirinden kopar.',
    },
  ],
})
