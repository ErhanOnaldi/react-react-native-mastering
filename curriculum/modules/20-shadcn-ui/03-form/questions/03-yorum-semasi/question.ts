import { defineQuestion } from '@rm/content/define'

export default defineQuestion({
  type: 'code',
  title: 'Yorum şemasına Türkçe mesajlar',
  difficulty: 'kolay',
  concepts: ['zod.schemas', 'zod.infer', 'form.rhf-errors', 'form.a11y'],
  files: ['reviewSchema.ts'],
  hints: [
    'Her alanın kullanıcıdan ne beklediğini ve geçersiz durumda hangi Türkçe mesajı göstereceğini prompt ile eşleştir.',
    'Metin için `z.string()`, puan için `z.number()` ile başla; sonra her alanın kurallarını sırayla ekle.',
    '`body` için `.trim().min(1, { error: "Yorum gerekli" }).max(500, { error: "Yorum en fazla 500 karakter olabilir" })` kullan. Puanın tip mesajı şema düzeyinde, tam sayı ve aralık mesajları ilgili kontrolde verilir.',
  ],
})
