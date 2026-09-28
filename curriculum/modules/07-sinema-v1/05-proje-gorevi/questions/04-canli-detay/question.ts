import { defineQuestion } from '@rm/content/define'

export default defineQuestion({
  type: 'project',
  title: 'Film detayını ve kadroyu göster',
  difficulty: 'zor',
  concepts: ['router.params', 'ts.narrowing', 'fetch.error-handling', 'fetch.tmdb-images'],
  project: 'sinema',
  focusFiles: ['src/pages/MovieDetailsPage.tsx', 'src/pages/FavoritesPage.tsx'],
  reviewFiles: ['src/pages/MovieDetailsPage.tsx', 'src/pages/FavoritesPage.tsx'],
  rubric: [
    'Geçersiz id isteksiz reddediliyor',
    'Detay ve favoriler gerçek API’den geliyor',
    'Kadro ve boş poster güvenle gösteriliyor',
  ],
  hints: [
    'Rota parametresinden gelen değeri sayıya dönüştürüp geçerli olup olmadığını sınamalısın; geçersizse istek atmadan erken dönüş yapmalısın.',
    '`useParams<{ id: string }>()` hook’unu kullanarak `id` değerini al. Sayı kontrolü için `Number(id)` veya `/^\d+$/.test(id)` kullanabilirsin.',
    '`const movieId = Number(id); if (Number.isNaN(movieId) || movieId <= 0) return <div role="alert">Geçersiz film adresi</div>;` şeklinde erken kontrol yap. Ardından `tmdbFetch<MovieDetails>(`/movie/${movieId}`, { append_to_response: "credits,videos" })` isteği at.',
    '`FavoritesPage` içinde favori kimlikleri döngüyle çekerken `Promise.all` kullanabilirsin; favori listesi boşken (`favoriteIds.length === 0`) hiçbir istek atmadan erken dönüş yapmayı unutma.',
  ],
})
