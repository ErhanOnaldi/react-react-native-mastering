import { defineQuestion } from '@rm/content/define'

export default defineQuestion({
  type: 'quiz',
  title: 'Sayfa tipinde sonuç',
  difficulty: 'kolay',
  concepts: ['ts.api-types'],
  question: '`MovieListResponse` içinde `results` için doğru tip nedir?',
  options: [
    { text: '`Movie[]`', correct: true, explanation: 'Bir sayfada birden çok film vardır.' },
    { text: '`Movie`', explanation: 'Tek film bir liste cevabını anlatmaz.' },
    { text: '`string[]`', explanation: 'Her eleman yalnızca başlık değil, film nesnesidir.' },
  ],
})
