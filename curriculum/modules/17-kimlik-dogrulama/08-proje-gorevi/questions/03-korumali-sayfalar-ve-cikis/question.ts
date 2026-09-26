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
    'Hangi sayfalar girişsiz açık kalmalı, çıkışta hangi eski kullanıcı verileri silinmeli?',
    'ProtectedRoute için Outlet ve Navigate kullan; /watchlists ile /profile aynı pathless parent’ın çocukları olsun.',
    'Çıkışta storage kaydını kaldır, resetStore callback’ini çağır ve queryClient.clear() ile cache’i temizle.',
  ],
})
