import { defineQuestion } from '@rm/content/define'

export default defineQuestion({
  type: 'quiz',
  title: 'Id gelene kadar bekle',
  difficulty: 'kolay',
  concepts: ['query.dependent', 'query.useQuery', 'router.params'],
  question:
    '`id: number | undefined` için sorgu id gelene dek başlamasın. Hook her render’da aynı sırada çağrılsın. Hangi düzen uygun?',
  options: [
    {
      text: '`enabled: id !== undefined` ayarla ve query function içinde id yoksa isteği durdur',
      correct: true,
      explanation: 'Hook çağrısı sabit kalır; `enabled` eksik id’de isteği başlatmaz.',
    },
    {
      text: '`enabled: Boolean(id)` ile beraber hook’u yalnız id varsa çağır',
      explanation: 'Hook çağrı sırası render’lar arasında değişemez.',
    },
    {
      text: '`queryFn` içinde id’yi kontrol etmeden `getMovieDetails(id!)` çağır',
      explanation:
        'Non-null assertion eksik id’de geçersiz URL riskini gizler; `enabled` bu fonksiyon içini otomatik daraltmaz.',
    },
  ],
})
