import { defineQuestion } from '@rm/content/define'
export default defineQuestion({
  type: 'code',
  title: 'Route loader cache’i hazırlar',
  difficulty: 'orta',
  concepts: ['query.router', 'router.loaders', 'query.query-options'],
  files: ['detailLoader.ts'],
  hints: [
    'params.id string veya undefined olabilir; önce doğrula.',
    'ensureQueryData aynı key ve queryFn’i alır.',
    'Loader sonuç Promise’ini doğrudan döndür.',
  ],
})
