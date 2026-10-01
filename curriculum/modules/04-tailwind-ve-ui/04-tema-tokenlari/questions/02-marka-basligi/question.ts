import { defineQuestion } from '@rm/content/define'

export default defineQuestion({
  type: 'code',
  title: 'Tema token’lı başlık',
  difficulty: 'orta',
  concepts: ['tailwind.theme', 'tailwind.dark-mode', 'react.props'],
  files: ['BrandHeading.tsx'],
  hints: [
    '`BrandHeading` sabit tema class’larını kendi almalı; gelen class sonradan birleştirilmeli.',
    '`cn` yardımcı fonksiyonunu kullan; JSX içinde template string ile boş değer ekleme.',
    '`cn("font-display text-brand-700 dark:text-brand-300", className)` sonucunu h2’ye ver.',
  ],
  preview: {
    entry: 'Preview.tsx',
  },
})
