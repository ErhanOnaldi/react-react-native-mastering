import { defineQuestion } from '@rm/content/define'

export default defineQuestion({
  type: 'code',
  title: 'Koşullu filtre class’ı',
  difficulty: 'orta',
  concepts: ['tailwind.cn', 'react.state', 'js.string-formatting'],
  files: ['filterClass.ts'],
  hints: [
    'Elle boşluk eklenen string dallarını bırak; koşulları sınıflandır.',
    '`clsx` içine ortak class ve iki ayrı ternary sonucu ver.',
    '`clsx("rounded-lg", active ? seçiliClass : pasifClass, compact ? küçükClass : normalClass)` biçimini kullan.',
  ],
})
