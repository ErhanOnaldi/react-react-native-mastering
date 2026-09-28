import { defineQuestion } from '@rm/content/define'

export default defineQuestion({
  type: 'code',
  title: 'Eski sayfayı koru',
  difficulty: 'orta',
  concepts: ['query.pagination', 'query.keys', 'router.search-params'],
  files: ['MoviePages.tsx'],
  hints: [
    'Page 1 ile page 2 ayrı sonuçtur; geçişte eski içerik yine kullanılabilir.',
    'Page’i query key ve request’e ekle; `placeholderData: keepPreviousData` kullan.',
    '`isPlaceholderData` iken `Yeni sayfa yükleniyor` yaz ve sonuçları render etmeye devam et.',
  ],
})
