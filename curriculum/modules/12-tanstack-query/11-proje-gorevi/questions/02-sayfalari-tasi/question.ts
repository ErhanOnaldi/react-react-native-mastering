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
    'Önce her sayfada server state ile client state’i ayır; URL’den gelen değerleri not et.',
    '`useQuery` ve `movieQueries` ile cevabı değiştiren her URL değerini sorgu kimliğine bağla.',
    'Boş aramada `skipToken`, sayfalamada `keepPreviousData`; detay key’inde route id kullan.',
  ],
  rubric: [
    'Dört sayfa Query cache’inden sunucu verisi okur; favori seçimi client state’te kalır.',
    'URL parametreleri query key’i değiştirdiği için doğru sayfa ve arama görünür.',
    'Taze cache’e geri dönüş yeni GET üretmez; geçici sayfalama verisi kullanıcıya açıklanır.',
  ],
})
