import { defineQuestion } from '@rm/content/define'

export default defineQuestion({
  type: 'code',
  title: 'Detay cache’i',
  difficulty: 'orta',
  concepts: ['query.useQuery', 'fetch.loading-states', 'test.msw'],
  files: ['MovieDetail.tsx'],
  hints: [
    'İlk açılış, HTTP hatası ve 60 saniye içindeki dönüş için hangi üç görünüm gerekir?',
    '`useQuery` ile sonucu oku; key’e `id`, seçeneklere `staleTime` ekle.',
    '`isPending` → yükleme; `isError` → hata; success → `<h2>{movie.data.title}</h2>`.',
    '`fetch` 500’de reject olmaz; `response.ok` değerini kontrol et.',
  ],
  preview: { entry: 'Preview.tsx' },
})
