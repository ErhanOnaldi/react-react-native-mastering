import { defineQuestion } from '@rm/content/define'

export default defineQuestion({
  type: 'code',
  title: 'Cache süresi',
  difficulty: 'orta',
  concepts: ['query.stale-gc', 'test.msw'],
  files: ['cachePolicy.ts'],
  hints: [
    'Tazeliği ve son abone ayrıldıktan sonraki bellek ömrünü birbirinden ayır.',
    'Sorgu ayarlarını döndüren nesnede `staleTime` ve `gcTime` tanımla; key’e film id’sini ekle.',
    'Id’yi query key’ine koy; options nesnesine `staleTime: 60_000` ve `gcTime: 300_000` ekle.',
  ],
})
