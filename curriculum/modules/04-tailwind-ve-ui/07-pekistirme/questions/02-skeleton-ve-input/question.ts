import { defineQuestion } from '@rm/content/define'

export default defineQuestion({
  type: 'code',
  title: 'Skeleton ve Input sözleşmesi',
  difficulty: 'orta',
  concepts: ['tailwind.cn', 'a11y.basics', 'react.props'],
  files: ['LoadingFields.tsx'],
  hints: [
    'Skeleton görsel, Input ise etkileşimli HTML öğesi.',
    '`ComponentProps<"div">` ve `ComponentProps<"input">` ile props aktar; className’i cn’ye ver.',
    'Skeleton’da `aria-hidden="true"` ve pulse; Input’ta `rounded-lg border px-3 py-2 focus-visible:outline-2` kullan.',
  ],
  timeoutMs: 60000,
  preview: {
    entry: 'Preview.tsx',
  },
})
