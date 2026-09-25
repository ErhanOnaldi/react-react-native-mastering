import { defineQuestion } from '@rm/content/define'

export default defineQuestion({
  type: 'code',
  title: 'Sunucu hatası handler’ı yaz',
  difficulty: 'orta',
  concepts: ['test.msw-overrides', 'fetch.error-handling'],
  files: ['errorHandler.ts'],
  hints: [
    'Handler’ı http.get ile fonksiyon içinde kur.',
    'HttpResponse.json(body, { status }) kullan.',
    'Önce status aralığını doğrula.',
  ],
})
