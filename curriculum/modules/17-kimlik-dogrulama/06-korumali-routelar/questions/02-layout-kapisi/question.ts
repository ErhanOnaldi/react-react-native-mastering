import { defineQuestion } from '@rm/content/define'
export default defineQuestion({
  type: 'code',
  title: 'Layout route kapısı',
  difficulty: 'orta',
  concepts: [
    'auth.protected-routes',
    'router.protected-routes',
    'router.nested-layouts',
    'react.conditional-rendering',
  ],
  files: ['ProtectedRoute.tsx'],
  hints: [
    'Koruma bileşeni çocuklarını doğrudan almaz; başarılı durumda Outlet döndürür.',
    'Giriş yoksa Navigate ile `/login` adresine git; replace kullan.',
    'useLocation ile eski pathname’i state.from olarak sakla.',
  ],
})
