import { defineQuestion } from '@rm/content/define'

export default defineQuestion({
  type: 'project',
  title: 'Sinema için rota iskeletini kur',
  difficulty: 'zor',
  concepts: ['router.setup', 'router.nested-layouts', 'router.navigation', 'react.context'],
  project: 'sinema',
  focusFiles: [
    'package.json',
    'src/router.tsx',
    'src/layouts/RootLayout.tsx',
    'src/main.tsx',
    'src/pages/HomePage.tsx',
    'src/pages/NotFoundPage.tsx',
  ],
  reviewFiles: ['src/router.tsx', 'src/layouts/RootLayout.tsx', 'src/main.tsx', 'src/pages/*.tsx'],
  rubric: [
    'Rota ağacı tek yerde ve testte yeniden kullanılabilir',
    'Ortak menü erişilebilir, aktif bağlantı doğru',
    'FavoritesProvider bütün route ağacını sarıyor',
  ],
  hints: [
    'Önce `react-router` bağımlılığını ekleyip `routes: RouteObject[]` dizisini kur.',
    'Kök route çocuklarında `index`, `search`, `movie/:id`, `favorites`, `*` kullan; layout içine `Outlet` ekle.',
    '`router = createBrowserRouter(routes)` export et; `main.tsx` içinde `FavoritesProvider` altında `<RouterProvider router={router} />` render et.',
  ],
})
