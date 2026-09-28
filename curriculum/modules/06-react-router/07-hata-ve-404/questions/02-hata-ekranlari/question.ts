import { defineQuestion } from '@rm/content/define'

export default defineQuestion({
  type: 'code',
  title: '404 ile rota hatasını ayır',
  difficulty: 'orta',
  concepts: ['router.error-boundary', 'ts.narrowing'],
  files: ['RouteScreens.tsx'],
  hints: [
    "Eşleşmeyen adres ile eşleşmiş route'un işlemi başarısız olduğunda hangi ekranların çalıştığını ayır.",
    '`useRouteError` sonucu bilinmez; Router response olup olmadığını `isRouteErrorResponse` ile daralt.',
    'Response status 404 ise 404 başlığı, diğer tüm durumlarda genel başlık ve her iki ekranda dönüş linki render et.',
  ],
})
