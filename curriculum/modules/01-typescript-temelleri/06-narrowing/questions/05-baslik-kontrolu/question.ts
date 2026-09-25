import { defineQuestion } from '@rm/content/define'

export default defineQuestion({
  type: 'code',
  title: 'Bilinmeyen başlığı ayır',
  difficulty: 'kolay',
  concepts: ['ts.narrowing', 'ts.unknown-any'],
  files: ['safeTitle.ts'],
  hints: [
    'Önce nesne ve null kontrolü yap.',
    '`in` ile title alanının varlığını sınayabilirsin.',
    'Son olarak `typeof value.title === "string"` kontrol et.',
  ],
})
