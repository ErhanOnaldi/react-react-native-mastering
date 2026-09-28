import { defineQuestion } from '@rm/content/define'

export default defineQuestion({
  type: 'quiz',
  title: '404 gelince Promise ne olur?',
  difficulty: 'kolay',
  concepts: ['web.http-anatomy', 'fetch.error-handling'],
  question:
    '`fetch("/api/films/999")` isteğine sunucu 404 cevabı verdi. `await fetch(...)` satırında ne olur?',
  options: [
    {
      text: 'Bir `Response` döner; `response.ok` false olur.',
      correct: true,
      explanation:
        'HTTP cevabı geldiği için `fetch` tamamlanır. 404 durumunu uygulama kontrol eder.',
    },
    {
      text: 'Promise otomatik olarak 404 hatasıyla reddedilir.',
      correct: false,
      explanation:
        '`fetch` HTTP hata durumlarında kendiliğinden reddetmez; ağ veya CORS engeli gibi durumda reddeder.',
    },
    {
      text: '404 cevabında `response.status` okunamaz.',
      correct: false,
      explanation: 'Response nesnesi vardır ve `status` 404 değerini taşır.',
    },
    {
      text: '`response.ok` true olur, çünkü sunucu cevap verdi.',
      correct: false,
      explanation: '`ok` yalnızca 200–299 aralığında true olur.',
    },
  ],
})
