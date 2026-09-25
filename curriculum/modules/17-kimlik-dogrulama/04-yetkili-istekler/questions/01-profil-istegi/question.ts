import { defineQuestion } from '@rm/content/define'
export default defineQuestion({
  type: 'code',
  title: 'Bearer ile profili oku',
  difficulty: 'kolay',
  concepts: ['fetch.headers-auth', 'fetch.error-handling', 'arch.api-client', 'auth.jwt'],
  files: ['profile.ts'],
  hints: [
    'Authorization başlığı tam olarak `Bearer ${accessToken}` biçimindedir.',
    'GET /auth/me isteğinden sonra response.ok kontrolü yap.',
    '401’de Error fırlat; başarılı JSON’dan id ve username döndür.',
  ],
})
