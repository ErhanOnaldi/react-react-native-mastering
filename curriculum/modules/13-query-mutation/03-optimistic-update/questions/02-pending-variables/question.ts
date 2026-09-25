import { defineQuestion } from '@rm/content/define'
export default defineQuestion({
  type: 'code',
  title: 'Bekleyen puanı göster',
  difficulty: 'orta',
  concepts: ['query.optimistic', 'query.useMutation', 'react.conditional-rendering'],
  files: ['PendingRating.tsx'],
  hints: [
    'mutation.variables yalnız mutation başladıktan sonra vardır.',
    'isPending ile geçici metni koşullu göster.',
    'Hata kolunda alert ver; geçici metin pending bitince kendiliğinden kaybolur.',
  ],
})
