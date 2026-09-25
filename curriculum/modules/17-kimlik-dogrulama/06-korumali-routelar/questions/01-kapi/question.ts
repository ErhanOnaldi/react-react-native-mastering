import { defineQuestion } from '@rm/content/define'
export default defineQuestion({
  type: 'quiz',
  title: 'Route kapısı ne sağlar?',
  difficulty: 'kolay',
  concepts: ['auth.protected-routes', 'router.protected-routes'],
  question: 'Sinema `/watchlists` için ProtectedRoute ekledi. Bu neyi garanti eder?',
  options: [
    {
      text: 'Normal tarayıcı gezinmesinde girişsiz kullanıcıyı login’e yönlendirir.',
      correct: true,
      explanation: 'Bu bir UI/gezinti kontrolüdür; verinin erişim iznini backend ayrıca uygular.',
    },
    {
      text: 'Yerel depodaki watchlist verisini sunucu düzeyinde gizler.',
      explanation: 'Client route koruması yerel depoyu ve API’yi güvenli hale getirmez.',
    },
    {
      text: 'JWT imzasını doğrular ve API’deki yetkiyi belirler.',
      explanation: 'İmza ve yetki kontrolü sunucunun sorumluluğudur.',
    },
  ],
})
