import { defineQuestion } from '@rm/content/define'
export default defineQuestion({
  type: 'code',
  title: 'Route loader cache’i hazırlar',
  difficulty: 'orta',
  concepts: ['query.router', 'router.loaders', 'query.query-options'],
  files: ['detailLoader.ts'],
  hints: [
    'Route parametresinin geçersiz olabileceğini ve aynı kimlik için tekrar çağrılacağını hesaba kat.',
    '`Number.isInteger` ile doğrula; TanStack Query’nin `ensureQueryData` işlevini kullan.',
    '`client.ensureQueryData({ queryKey: ["movie", id], queryFn: () => load(id) })` sonucunu döndür.',
    'Doğrulamadan önce `load` çağırma; aynı key ikinci çağrıda cache’den gelsin.',
  ],
})
