import { defineQuestion } from '@rm/content/define'
export default defineQuestion({
  type: 'project',
  title: 'Watchlist’i koru ve çıkışta temizle',
  difficulty: 'zor',
  project: 'sinema',
  concepts: [
    'auth.protected-routes',
    'router.nested-layouts',
    'router.protected-routes',
    'query.useQuery',
    'redux.store',
  ],
  focusFiles: [
    'src/features/auth/ProtectedRoute.tsx',
    'src/features/auth/logout.ts',
    'src/router.tsx',
    'src/pages/LoginPage.tsx',
    'src/pages/ProfilePage.tsx',
  ],
  hints: [
    'ProtectedRoute başarılı durumda Outlet, girişsiz durumda Navigate döndürsün.',
    'router.tsx içinde /watchlists ve /profile aynı pathless parent’ın çocukları olsun.',
    'Çıkışta storage, auth/watchlist store state’i ve queryClient cache’ini temizle.',
  ],
})
