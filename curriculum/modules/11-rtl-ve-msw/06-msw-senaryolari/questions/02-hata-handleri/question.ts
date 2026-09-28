import { defineQuestion } from '@rm/content/define'

export default defineQuestion({
  type: 'code',
  title: 'Sunucu hatası handler’ı yaz',
  difficulty: 'orta',
  concepts: ['test.msw-overrides', 'fetch.error-handling'],
  files: ['errorHandler.ts'],
  hints: [
    'Geçerli hata kodu aralığını response oluşturmadan önce kontrol et.',
    '`http.get` handler’ı ve `HttpResponse.json(body, { status })` kullan.',
    '400–599 dışında `RangeError` fırlat; geçerli değeri response status’una aktar.',
  ],
})
