import { defineQuestion } from '@rm/content/define'
export default defineQuestion({
  type: 'project',
  title: 'Oturum, POST/DELETE ve rated query',
  difficulty: 'zor',
  concepts: ['fetch.headers-auth', 'query.query-options', 'query.useMutation'],
  project: 'sinema',
  focusFiles: [
    'src/features/rating/api/rating-api.ts',
    'src/features/rating/api/rating-queries.ts',
  ],
  hints: [
    'Session kimliğinin ne zaman yaratılacağını ve tekrar çağrılarda nasıl korunacağını belirle.',
    'Mevcut `tmdbClient` yetkilendirme/hata davranışını ve TanStack Query `queryOptions` yardımcısını kullan.',
    'API fonksiyonlarını kur; rated query key’ine session id ekleyip liste cevabını döndür.',
  ],
})
