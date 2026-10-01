import { defineQuestion } from '@rm/content/define'

export default defineQuestion({
  type: 'code',
  title: 'Detay cache’i',
  difficulty: 'orta',
  concepts: ['query.useQuery', 'fetch.loading-states', 'test.msw'],
  files: ['MovieDetail.tsx'],
  hints: [
    'İlk açılış ve HTTP hatasında hangi görünümler gerekir; film değişince hangi değer yeni sorguyu seçer?',
    '`useQuery` ile sonucu oku ve film `id` değerini key’e ekle.',
    '`isPending` → yükleme; `isError` → hata; success → `<h2>{movie.data.title}</h2>`.',
    '`fetch` 500’de reject olmaz; `response.ok` değerini kontrol et.',
  ],
  preview: { entry: 'Preview.tsx' },
})
