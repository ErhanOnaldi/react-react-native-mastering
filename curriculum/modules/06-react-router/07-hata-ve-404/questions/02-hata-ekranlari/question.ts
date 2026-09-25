import { defineQuestion } from '@rm/content/define'

export default defineQuestion({
  type: 'code',
  title: '404 ile rota hatasını ayır',
  difficulty: 'orta',
  concepts: ['router.error-boundary', 'ts.narrowing'],
  files: ['RouteScreens.tsx'],
  hints: [
    'Önce iki ayrı hata yüzeyi yaz.',
    '`useRouteError` sonucunu `isRouteErrorResponse` ile denetle; 404 ve diğerlerini ayır.',
  ],
})
