import { defineQuestion } from '@rm/content/define'

export default defineQuestion({
  type: 'code',
  title: 'Layout seviyesinde koruma',
  difficulty: 'kolay',
  concepts: [
    'auth.protected-routes',
    'router.protected-routes',
    'router.nested-layouts',
    'react.components',
  ],
  files: ['ProtectedRoute.tsx'],
  hints: [
    "React Router'ın layout rotalarında alt elemanları basmak ve deklaratif yönlendirme yapmak için sunduğu bileşenleri incele.",
    '`react-router` paketinden `Navigate`, `Outlet` ve `useLocation` import et.',
    'Oturum yoksa `return <Navigate to="/login" replace state={{ from: location.pathname }} />`, oturum varsa `return <Outlet />` döndür.',
    "`replace` prop'unu unutursan tarayıcı geçmişine yeni bir girdi eklenir ve kullanıcı login ekranındayken geri butonuna bastığında kilitlenir.",
  ],
})
