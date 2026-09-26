import { defineQuestion } from '@rm/content/define'

export default defineQuestion({
  type: 'code',
  title: 'Film kartında anlamsal renk',
  difficulty: 'kolay',
  concepts: ['shadcn.theming', 'tailwind.theme', 'tailwind.cn', 'react.props'],
  files: ['ThemeCard.tsx'],
  hints: [
    'Kartın yüzeyi ve üstündeki metin için `card` token çiftini düşün.',
    '`className` alanını sabit sınıflara eklerken önceki `cn` fikrini kullan.',
    '`cn("rounded-lg bg-card text-card-foreground", className)` değerini `<article>` üzerine koy.',
  ],
})
