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
    '`useParams()` id değerini doğrulayıp `/movie/:id` çağrısını kur.',
    '`append_to_response: "credits,videos"` ile detay ve kadroyu tek cevapta al.',
    'FavoritesPage’de her favori id için detay isteği yapıp sonuçları kart tipine uyarlayabilirsin.',
  ],
})
