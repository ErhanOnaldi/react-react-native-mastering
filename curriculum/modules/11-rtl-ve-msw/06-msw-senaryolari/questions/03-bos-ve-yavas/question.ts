import { defineQuestion } from '@rm/content/define'

export default defineQuestion({
  type: 'code',
  title: 'Boş ve yavaş arama cevabı',
  difficulty: 'orta',
  concepts: ['test.msw-overrides', 'test.async'],
  files: ['emptyHandler.ts'],
  hints: [
    'İstekten sayfa bilgisini al, geçersiz değeri reddet ve liste yanıtını kur.',
    '`await delay(waitMs)`, `new URL(request.url).searchParams` ve `HttpResponse.json` kullan.',
    'Query’yi sayıya çevir; `Number.isInteger(page)` ve `page < 1` kontrollerinden sonra success veya 400 response’u döndür.',
  ],
})
