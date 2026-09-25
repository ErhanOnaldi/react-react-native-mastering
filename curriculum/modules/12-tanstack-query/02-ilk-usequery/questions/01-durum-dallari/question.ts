import { defineQuestion } from '@rm/content/define'

export default defineQuestion({
  type: 'quiz',
  title: 'Query durum dalları',
  difficulty: 'kolay',
  concepts: ['query.useQuery', 'fetch.loading-states', 'ts.discriminated-union'],
  question:
    'İlk istek bitti, cache’de eski sonuç var ve arka planda yenileme başladı. Hangi ifade doğru?',
  options: [
    {
      text: '`isFetching` true olabilir; `isPending` false kalabilir',
      correct: true,
      explanation: 'Veri görünürken ağ yenilemesi sürebilir.',
    },
    {
      text: '`isPending` her ağ isteğinde true olur',
      explanation:
        'Pending ilk kullanılabilir veri yokluğunu anlatır; arka plan yenilemesi farklıdır.',
    },
    {
      text: '`status` aynı anda success ve error olur',
      explanation: 'Status ayrımlı union’dır; aynı anda iki dalda olamaz.',
    },
  ],
})
