import { defineQuestion } from '@rm/content/define'

export default defineQuestion({
  type: 'code',
  title: 'Badge ve Card oluştur',
  difficulty: 'orta',
  concepts: ['tailwind.cn', 'react.composition', 'react.props'],
  files: ['UiPieces.tsx'],
  hints: [
    'İki bileşen için doğal HTML öğelerini seç: span ve article.',
    '`ComponentProps` ile children, data ve aria props’larını al; className’i ayır.',
    '`cn("rounded-xl border p-4", className)` Card’da; Badge’de `rounded-full bg-sky-100 px-2` kullan.',
  ],
  timeoutMs: 60000,
  preview: {
    entry: 'Preview.tsx',
  },
})
