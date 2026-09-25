import { defineQuestion } from '@rm/content/define'

export default defineQuestion({
  type: 'project',
  title: 'Sinema sayfalarını URL’ye bağla',
  difficulty: 'zor',
  concepts: [
    'router.params',
    'router.search-params',
    'router.navigation',
    'react.context',
    'react.derived-state',
  ],
  project: 'sinema',
  focusFiles: [
    'src/pages/SearchPage.tsx',
    'src/pages/MovieDetailsPage.tsx',
    'src/pages/FavoritesPage.tsx',
    'src/pages/HomePage.tsx',
    'src/components/MovieCard.tsx',
  ],
  reviewFiles: ['src/pages/*.tsx', 'src/components/MovieCard.tsx', 'src/layouts/RootLayout.tsx'],
  rubric: [
    'URL tek arama kaynağı; filtre değişimi sayfayı sıfırlıyor',
    'Detay sayfası id biçimi ve bulunamayan filmi ayrı ele alıyor',
    'Favoriler mevcut Context durumunu kullanıyor',
  ],
  hints: [
    'Önce `SearchPage` içinde `useSearchParams` ile `q` değerini oku; sampleMovies filtresini bu değerden türet.',
    'Sorgu veya genre değişince `page` sil; diğer URL anahtarlarını koru.',
    'Detayda `useParams` id değerini doğrula, sayıya çevirip `sampleMovies.find` ile ara; favorilerde `useFavorites` kullan.',
  ],
})
