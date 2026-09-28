import { defineQuestion } from '@rm/content/define'

export default defineQuestion({
  type: 'project',
  title: 'Tür filtresi ve sayfalama ekle',
  difficulty: 'zor',
  concepts: [
    'router.search-params',
    'fetch.query-params',
    'react.derived-state',
    'fetch.loading-states',
  ],
  project: 'sinema',
  focusFiles: ['src/pages/HomePage.tsx', 'src/pages/SearchPage.tsx'],
  reviewFiles: ['src/pages/HomePage.tsx', 'src/pages/SearchPage.tsx'],
  rubric: [
    'Tür değişimi page değerini sıfırlıyor',
    'URL aynı görünümü yeniden kuruyor',
    'total_pages sınırı aşılamıyor',
  ],
  hints: [
    'Tür ve sayfa değerlerini URL arama parametrelerinden okuyup, URL’deki değişikliklere göre ilgili TMDB uç noktasına yönelmelisin.',
    '`useSearchParams` hook’u ile `genre` ve `page` değerlerini oku; tür değiştiğinde `searchParams.delete("page")` çağrısı yaparak sayfayı sıfırla.',
    '`const genre = searchParams.get("genre"); const page = Number(searchParams.get("page") ?? "1");`. `genre` varsa `tmdbFetch("/discover/movie", { with_genres: genre, page })`, yoksa `tmdbFetch("/trending/movie/week", { page })` çağrısı yap.',
    'Sayfalama düğmelerinde `disabled={page >= total_pages}` kontrolü koymazsan kullanıcı var olmayan sayfalara geçmeye çalışıp boş ekranla karşılaşabilir.',
  ],
})
