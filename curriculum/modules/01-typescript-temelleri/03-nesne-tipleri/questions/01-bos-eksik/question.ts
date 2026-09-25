import { defineQuestion } from '@rm/content/define'

export default defineQuestion({
  type: 'quiz',
  title: "Boş alan mı eksik alan mı?",
  difficulty: 'kolay',
  concepts: ['ts.optional-nullable'],
  question: "TMDB bazen `poster_path: null`, ama `release_date: \"\"` gönderiyor. Hangi model doğru?",
  options: [
    { text: "`poster_path: string | null; release_date: string`", correct: true, explanation: "Poster null olabilir; boş tarih hâlâ string’dir." },
    { text: "`poster_path?: string; release_date?: string`", explanation: "`?` alanın yokluğunu anlatır; burada alanlar geliyor." },
    { text: "`poster_path: string; release_date: Date`", explanation: "Poster null olabilir; tarih JSON’da Date değil string gelir." }
  ],
})
