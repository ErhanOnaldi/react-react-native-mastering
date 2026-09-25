import { defineQuestion } from '@rm/content/define'

export default defineQuestion({
  type: 'code',
  title: 'Tipli ve erişilebilir Button',
  difficulty: 'orta',
  concepts: ['tailwind.cva', 'tailwind.cn', 'react.props', 'a11y.basics'],
  files: ['Button.tsx'],
  hints: [
    'Önce cva tablosuna üç görünüm ve üç boyutu yerleştir.',
    'Button props’unu `VariantProps<typeof buttonVariants>` ve doğal button props’larıyla kur.',
    '`cn(buttonVariants({ variant, size }), className)` sonucunu `<button {...props}>` üzerinde kullan.',
  ],
  timeoutMs: 60000,
  preview: {
    entry: 'Preview.tsx',
  },
})
