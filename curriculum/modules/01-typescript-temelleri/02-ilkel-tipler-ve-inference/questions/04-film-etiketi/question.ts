import { defineQuestion } from '@rm/content/define'

export default defineQuestion({
  type: 'code',
  title: 'Çıkarımla film etiketi',
  difficulty: 'kolay',
  concepts: ['ts.inference', 'js.string-formatting'],
  files: ['movieBadge.ts'],
  hints: [
    '`adult` boolean değerine göre iki kısa metinden birini seç.',
    'Puanı `.toFixed(1)` ile metne çevir.',
    'Şablon metinde `audience` ve biçimlenmiş puanı birleştir.',
  ],
})
