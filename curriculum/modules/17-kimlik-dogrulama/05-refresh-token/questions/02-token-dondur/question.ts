import { defineQuestion } from '@rm/content/define'

export default defineQuestion({
  type: 'code',
  title: 'Refresh token ile çifti döndür',
  difficulty: 'orta',
  concepts: ['auth.refresh', 'auth.token-storage', 'fetch.error-handling'],
  files: ['refreshSession.ts'],
  hints: [
    'Önce `storage.getTokens()` ile eldeki oturumu denetle; ardından yenileme uç noktasına POST isteği at.',
    '`https://dummyjson.com/auth/refresh` adresine `{ refreshToken }` gövdesiyle JSON isteği gönder; `response.ok` false ise hata fırlat.',
    'Başarılı yanıttan `accessToken` ve `refreshToken` alanlarını al, `storage.setTokens(fresh)` ile kaydet ve nesneyi döndür.',
    'Hata durumunda `storage.setTokens` çağrılmamalıdır; sunucu 403 döndüğünde depodaki eski belirteçleri bozmadan doğrudan hata fırlat.',
  ],
})
