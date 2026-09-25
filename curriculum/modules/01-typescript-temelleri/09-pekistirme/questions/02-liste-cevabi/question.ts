import { defineQuestion } from '@rm/content/define'

export default defineQuestion({
  type: 'code',
  title: "TMDB liste cevabını modelle",
  difficulty: 'orta',
  concepts: ["ts.api-types", "ts.object-types", "ts.arrays-tuples"],
  files: ['tmdbList.ts'],
  hints: ["Liste cevabını dış nesne ve `results` dizisi olarak düşün.", "`results: Movie[]` ve sayfa alanlarını ayrı yaz.", "Başlıklar için `response.results.map(movie => movie.title)` kullan."],
})
