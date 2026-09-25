import { defineQuestion } from '@rm/content/define'

export default defineQuestion({
  type: 'code',
  title: 'Eski sayfayı koru',
  difficulty: 'orta',
  concepts: ['query.pagination', 'query.keys', 'router.search-params'],
  files: ['MoviePages.tsx'],
  hints: [
    '`page` değerini key ve istek URL’sine koy.',
    '`placeholderData` için v5’in `keepPreviousData` fonksiyonunu kullan.',
    '`isPlaceholderData` true iken geçici durum yazısını, başarıda `data.results` listesini göster.',
  ],
})
