import { defineQuestion } from '@rm/content/define'

export default defineQuestion({
  type: 'code',
  title: 'Yorum şemasına Türkçe mesajlar',
  difficulty: 'kolay',
  concepts: ['zod.schemas', 'zod.infer', 'form.rhf-errors', 'form.a11y'],
  files: ['reviewSchema.ts'],
  hints: [
    'Kurallar zaten doğru; eksik olan mesajlar. Zod 4’te mesaj her kurala `{ error: "…" }` ile verilir.',
    '“Puan seç” bir kontrol mesajı değil, **tip** mesajı: değer hiç yokken hangi kontrol çalışır? Mesajı şemanın kendisine ver.',
    '`z.number({ error: "Puan seç" }).int({ error: "Puan tam sayı olmalı" }).min(1, { error: "…" }).max(5, { error: "…" })`',
  ],
})
