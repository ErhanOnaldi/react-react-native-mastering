import { defineQuestion } from '@rm/content/define'
export default defineQuestion({
  type: 'code',
  title: 'Giriş yap ve JWT payload’ını oku',
  difficulty: 'orta',
  concepts: ['auth.jwt', 'fetch.error-handling', 'js.async-await', 'ts.api-types'],
  files: ['login.ts'],
  hints: [
    'Önce response.ok kontrol et; fetch 400 için kendiliğinden throw yapmaz.',
    'JWT’nin ikinci parçasını base64url → base64 yap, padding ekle, atob ve JSON.parse kullan.',
    'Decode sonucu yalnız veri okumadır; exp değerini sayı olarak kontrol et ve hatalı token’da null dön.',
  ],
})
