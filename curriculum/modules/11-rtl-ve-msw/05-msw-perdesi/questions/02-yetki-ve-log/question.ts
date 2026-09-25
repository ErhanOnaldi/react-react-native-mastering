import { defineQuestion } from '@rm/content/define'

export default defineQuestion({
  type: 'quiz',
  title: '401 ve istek günlüğü',
  difficulty: 'kolay',
  concepts: ['test.msw', 'fetch.headers-auth'],
  question:
    'Authorization başlığı olmadan /3/movie/550 istersen ve requests() okursan ne görürsün?',
  options: [
    {
      text: '401 yanıtı; istek yine günlükte kayıtlıdır',
      correct: true,
      explanation: 'request:start isteği yanıtından önce kaydeder; auth handler 401 döndürür.',
    },
    {
      text: 'Film gelir; fixture ortamında token gerekmiyor',
      explanation: 'Sahte TMDB de Bearer veya api_key ister.',
    },
    {
      text: 'İstek hiç kaydedilmez çünkü 401 olur',
      explanation: 'Günlük istek başlangıcını kaydeder; yanıt durumuna bağlı değildir.',
    },
  ],
})
