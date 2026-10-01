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
    'Parametreyi sayıya çevirdikten sonra pozitif tam sayı olup olmadığını kontrol et. Hatalıysa ağ çağrısı başlamadan kullanıcıya erişilebilir bir uyarı göster.',
    'Detay cevabında oyuncu listesinin hangi alanda olduğunu bul. Favorilerde birden fazla kimliği yüklerken boş listeyi ayrıca ele al ve mevcut kart görünümünü koru.',
  ],
})
