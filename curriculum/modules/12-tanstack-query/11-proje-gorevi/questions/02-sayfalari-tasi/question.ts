import { defineQuestion } from '@rm/content/define'

export default defineQuestion({
  type: 'project',
  title: 'Sayfaları Query’ye taşı',
  difficulty: 'zor',
  concepts: ['query.useQuery', 'query.pagination', 'router.search-params', 'react.custom-hooks'],
  project: 'sinema',
  focusFiles: [
    'src/pages/HomePage.tsx',
    'src/pages/SearchPage.tsx',
    'src/pages/MovieDetailsPage.tsx',
    'src/pages/FavoritesPage.tsx',
  ],
  hints: [
    'Önce SearchPage’deki useEffect/state üçlüsünü tek useQuery ile değiştir.',
    '`q`, `page` ve `genre` değerlerini `movieQueries` key factory’ye parametre olarak ver; boş aramada `enabled` veya `skipToken` kullan.',
    'Pagination sorgusunda `placeholderData: keepPreviousData` ve geçici durumu belirtmek için `isPlaceholderData` kullan; detayda id değişimi key’den gelsin.',
  ],
  rubric: [
    'Dört sayfa Query cache’inden sunucu verisi okur; favori seçimi client state’te kalır.',
    'URL parametreleri query key’i değiştirdiği için doğru sayfa ve arama görünür.',
    'Taze cache’e geri dönüş yeni GET üretmez; geçici sayfalama verisi kullanıcıya açıklanır.',
  ],
})
