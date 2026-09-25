import { defineQuestion } from '@rm/content/define'

export default defineQuestion({
  type: 'quiz',
  title: 'Geri dönüş sayacı',
  difficulty: 'kolay',
  concepts: ['fetch.basics', 'router.navigation', 'query.keys'],
  question:
    'Sinema v1’de arama → detay → geri akışı, `StrictMode` olmadan, cache yokken `requests("/3/search/movie")` kaç olur?',
  options: [
    {
      text: '2',
      correct: true,
      explanation: 'İlk mount ve geri dönüşteki yeni mount birer GET başlatır.',
    },
    {
      text: '1',
      explanation: 'Router eski component state’ini ve API cevabını geri dönüş için saklamaz.',
    },
    { text: '0', explanation: 'İlk arama canlı TMDB isteği başlatır.' },
    {
      text: 'Her render için bir GET',
      explanation: 'İstek render gövdesinde değil effect’te; yeni mount sayılır.',
    },
  ],
})
