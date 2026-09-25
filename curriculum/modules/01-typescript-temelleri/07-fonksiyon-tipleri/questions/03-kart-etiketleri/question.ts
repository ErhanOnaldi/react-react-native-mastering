import { defineQuestion } from '@rm/content/define'

export default defineQuestion({
  type: 'code',
  title: "Callback ile kart etiketleri",
  difficulty: 'kolay',
  concepts: ["ts.functions", "js.array-methods"],
  files: ['cardLabels.ts'],
  hints: ["Her filmden bir etiket üretmek için `map` kullan.", "Callback içindeki tarih boşsa fallback seç.", "Dolu tarihin ilk dört karakterini şablon metne ekle."],
})
