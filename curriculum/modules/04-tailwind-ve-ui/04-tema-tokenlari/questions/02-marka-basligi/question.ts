import { defineQuestion } from '@rm/content/define'

export default defineQuestion({
  type: 'code',
  title: 'Tema token’lı başlık',
  difficulty: 'orta',
  concepts: ['tailwind.theme', 'tailwind.dark-mode', 'react.props'],
  files: ['BrandHeading.tsx'],
  hints: [
    'Başlığın rengi sabit hex değil tema token adıyla anlatılmalı.',
    'h2 için `font-display`, açık ve koyu tema renk class’larını birleştir.',
    '`font-display text-brand-700 dark:text-brand-300` ile gelen className’i aynı h2 üzerinde kullan.',
  ],
  preview: {
    entry: 'Preview.tsx',
  },
})
