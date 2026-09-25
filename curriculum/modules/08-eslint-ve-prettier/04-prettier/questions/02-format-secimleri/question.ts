import { defineQuestion } from '@rm/content/define'

export default defineQuestion({
  type: 'code',
  title: 'Sinema format seçenekleri',
  difficulty: 'kolay',
  concepts: ['tooling.prettier'],
  files: ['formatOptions.ts'],
  hints: [
    'Beklenen tırnak ve `;` farkını `prettier.format` çıktısında gör.',
    '`singleQuote` ve `semi` seçeneklerini ekle.',
    '`printWidth: 80` değerini de ayarla.',
  ],
})
