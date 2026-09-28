import { defineQuestion } from '@rm/content/define'

export default defineQuestion({
  type: 'project',
  title: 'Korumalı sayfalar ve çıkış',
  difficulty: 'orta',
  project: 'sinema',
  concepts: [
    'auth.protected-routes',
    'router.protected-routes',
    'auth.token-storage',
    'query.useQuery',
  ],
  focusFiles: [
    'src/features/auth/ProtectedRoute.tsx',
    'src/features/auth/logout.ts',
    'src/router.tsx',
    'src/pages/LoginPage.tsx',
  ],
  hints: [
    "React Router'da yolsuz (pathless) bir ebeveyn layout tanımlayarak `/watchlists` ve `/profile` rotalarını ortak korumaya al.",
    '`ProtectedRoute` içinde oturum varsa `<Outlet />`, yoksa `<Navigate to="/login" replace state={{ from: location.pathname }} />` döndür.',
    '`logout` fonksiyonunda sırasıyla `storage.removeItem("sinema-auth")`, `resetStore()` ve `queryClient.clear()` çağrılarını gerçekleştir.',
    "`/login` sayfasını korumalı layout'un çocukları arasına koyma; aksi takdirde kullanıcı sonsuz yönlendirme döngüsüne girer.",
  ],
})
