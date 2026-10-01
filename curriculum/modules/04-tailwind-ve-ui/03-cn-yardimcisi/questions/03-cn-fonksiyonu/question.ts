import { defineQuestion } from '@rm/content/define'

export default defineQuestion({
  type: 'code',
  title: 'Çakışmaları çöz: cn()',
  difficulty: 'orta',
  concepts: ['tailwind.cn', 'ts.functions'],
  files: ['cn.ts'],
  hints: [
    '`clsx` koşulları birleştirir; padding çakışmasını tek başına çözmez.',
    '`twMerge` birleşmiş class string’ini almalı.',
    '`return twMerge(clsx(inputs))` ve parametre tipi `ClassValue[]` kullan.',
  ],
})
