import { defineQuestion } from '@rm/content/define'

export default defineQuestion({
  type: 'code',
  title: "Karta giden veri",
  difficulty: 'kolay',
  concepts: ["ts.object-types", "js.destructuring"],
  files: ['cardData.ts'],
  hints: ["Etiket için üç alan yeterli; fazlasını tipte zorunlu kılma.", "Puanı `.toFixed(1)` ile biçimlendir.", "`{ id: movie.id, label: `${movie.title} (${...})` }` yapısını kur."],
})
