import { defineQuestion } from '@rm/content/define'

export default defineQuestion({
  type: 'project',
  title: 'Ana sayfada haftalık trendi göster',
  difficulty: 'orta',
  concepts: ['fetch.basics', 'fetch.loading-states', 'react.useEffect.deps', 'react.context'],
  project: 'sinema',
  focusFiles: ['src/pages/HomePage.tsx', 'src/components/MovieGrid.tsx'],
  reviewFiles: ['src/pages/HomePage.tsx'],
  rubric: ['Ana sayfa statik örnekleri kullanmıyor', 'Loading, hata ve boş liste ayrılıyor'],
  hints: [
    'Bileşen bağlandığında (mount) bir kez çalışacak asenkron bir veri çekme akışı kurmalısın.',
    'Bileşende `useEffect` veya projedeki `useFetch` hook’unu kullanarak `/trending/movie/week` yoluna `tmdbFetch` isteği atabilirsin.',
    '`const [data, setData] = useState<MovieListResponse | null>(null)` ve `const [loading, setLoading] = useState(true)` durumlarını yönet. İstek bitince `setData(res)` ve `setLoading(false)` yap; `data?.results` dizisini `<MovieGrid movies={data.results} />` bileşenine aktar.',
    'Testlerin `getByText(/filmler yükleniyor/i)` kontrolünü geçebilmesi için yükleme anında tam olarak bu ifadeyi içeren bir durum metni render etmeyi unutma.',
  ],
})
