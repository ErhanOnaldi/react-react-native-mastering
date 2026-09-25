import { defineQuestion } from '@rm/content/define'

export default defineQuestion({
  type: 'quiz',
  title: 'Bilinmeyen adres',
  difficulty: 'orta',
  concepts: ['router.error-boundary', 'ts.narrowing'],
  question:
    '`/hic-yok` için özel 404, route içindeki hata için ayrı mesaj istiyorsun. Ne kurarsın?',
  options: [
    {
      text: '`path: "*"` ve `errorElement`; hata değerini `isRouteErrorResponse` ile daralt.',
      correct: true,
      explanation: 'Doğru. Eşleşmeyen yol ve eşleşmiş route hatası iki ayrı durumdur.',
    },
    {
      text: 'Yalnızca `errorElement`.',
      explanation: 'Bu, bilinmeyen URL için bilinçli bir 404 sayfasının yerini tutmaz.',
    },
    {
      text: 'Hata değerini doğrudan `error.status` olarak oku.',
      explanation: '`useRouteError()` bilinmeyen değer döner; önce daralt.',
    },
  ],
})
