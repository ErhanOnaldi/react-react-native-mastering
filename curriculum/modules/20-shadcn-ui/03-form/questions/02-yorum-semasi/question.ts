import { defineQuestion } from '@rm/content/define'

export default defineQuestion({
  type: 'code',
  title: 'Yorum şemasına Türkçe mesajlar',
  difficulty: 'kolay',
  concepts: ['zod.schemas', 'zod.infer', 'form.rhf-errors', 'form.a11y'],
  files: ['reviewSchema.ts'],
  hints: [
    'Kontrolleri giriş sırasına göre ele al: metni temizle, boşluğu reddet, sonra üst sınırı uygula.',
    'Zod 4 doğrulama mesajları için `error` seçeneğini kullanır; tip hatası ile kural ihlalinin farklı noktaları vardır.',
    '`z.number({ error: "Puan seç" }).int({ error: "Puan tam sayı olmalı" }).min(1, { error: "Puan 1 ile 5 arasında olmalı" }).max(5, { error: "Puan 1 ile 5 arasında olmalı" })`',
  ],
})
