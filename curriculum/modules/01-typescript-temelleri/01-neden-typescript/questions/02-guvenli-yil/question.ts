import { defineQuestion } from '@rm/content/define'

export default defineQuestion({
  type: 'code',
  title: "Yıl etiketindeki yazım hatası",
  difficulty: 'kolay',
  concepts: ["ts.object-types", "tooling.type-check"],
  files: ['movieYear.ts'],
  hints: ["Yanlış yazılmış alan adı yerine sözleşmedeki `release_date` alanını kullan.", "Boş string için erken dönüş yap.", "Dolu tarihte `.slice(0, 4)` kullan."],
})
