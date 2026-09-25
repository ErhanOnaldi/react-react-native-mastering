import { defineQuestion } from '@rm/content/define'
export default defineQuestion({
  type: 'code',
  title: 'Refresh token’ı döndür',
  difficulty: 'orta',
  concepts: ['auth.refresh', 'fetch.error-handling', 'js.async-await'],
  files: ['refreshSession.ts'],
  hints: [
    'Refresh isteği POST ve JSON gövdeli: `{ refreshToken }`.',
    '403’te hata fırlat; eski token çiftini değiştirme.',
    'Başarıda access ve refresh token’ı aynı anda `storage.setTokens` ile kaydet.',
  ],
})
