import { defineQuestion } from '@rm/content/define'

export default defineQuestion({
  type: 'quiz',
  title: 'Eksik id',
  difficulty: 'kolay',
  concepts: ['query.dependent', 'ts.narrowing', 'router.params'],
  question:
    '`id: number | undefined` için sorgu id gelene dek başlamasın, tip çıkarımı korunsun. Hangisi uygun?',
  options: [
    {
      text: '`queryFn: id === undefined ? skipToken : () => getMovieDetails(id)`',
      correct: true,
      explanation: 'skipToken eksik id’de sorguyu kapatır; diğer dalda id daralır.',
    },
    {
      text: 'Hook’u `if (id) useQuery(...)` içinde çağır',
      explanation: 'Hook çağrı sırası render’lar arasında değişemez.',
    },
    {
      text: '`queryFn: () => getMovieDetails(id!)`',
      explanation: 'Non-null assertion eksik id’de geçersiz istek riskini gizler.',
    },
  ],
})
