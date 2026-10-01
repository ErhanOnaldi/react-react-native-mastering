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
    'Korumalı alt sayfayı gösterme ve oturum yokken başka bir adrese gitme işini hangi route bileşenleri yapar?',
    '`react-router` içinden `Navigate`, `Outlet` ve `useLocation` araçlarını kullan.',
    'Oturum durumuna göre bir dal çocuk rotayı göstermeli, öteki `/login` adresine `replace` ile gitmeli ve `location.pathname` değerini `state.from` içine koymalı.',
    '`replace` geçmişteki korumalı adresi değiştirdiği için geri tuşu tekrar tekrar login yönlendirmesine düşmez.',
  ],
})
