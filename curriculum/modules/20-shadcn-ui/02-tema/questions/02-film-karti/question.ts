import { defineQuestion } from '@rm/content/define'

export default defineQuestion({
  type: 'code',
  title: 'Film kartında anlamsal renk',
  difficulty: 'kolay',
  concepts: ['shadcn.theming', 'tailwind.theme', 'tailwind.cn', 'react.props'],
  files: ['ThemeCard.tsx'],
  hints: [
    'Önce rolü ve semantiği seç: bu içerik hangi HTML öğesi ve başlık düzeyi olmalı?',
    'Tailwind sınıflarını `clsx` ve `tailwind-merge` ile birleştirip utility çakışmasını çöz.',
    'Sabit sınıfları `rounded-lg bg-card text-card-foreground` olarak başlat; `className` değerini en sona ver.',
  ],
})
