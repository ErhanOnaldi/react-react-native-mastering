import { defineQuestion } from '@rm/content/define'

export default defineQuestion({
  type: 'quiz',
  title: "Map sonucunun tipi",
  difficulty: 'kolay',
  concepts: ['ts.arrays-tuples'],
  question: "`movies: Movie[]` üzerinde `movies.map(movie => movie.title)` sonucu nedir?",
  options: [
    { text: "`string[]`", correct: true, explanation: "Her callback string döndürür; map bunları diziye toplar." },
    { text: "`Movie[]`", explanation: "map sonucu callback’in dönüş tipine göre değişir." },
    { text: "`[Movie, string]`", explanation: "Tuple iki sabit konumu anlatır; map dizi döndürür." }
  ],
})
