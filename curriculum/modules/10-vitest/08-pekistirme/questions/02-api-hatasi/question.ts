import { defineQuestion } from '@rm/content/define'

export default defineQuestion({
  type: 'code',
  title: 'API hatası ayrıntılarını test et',
  difficulty: 'orta',
  concepts: ['test.mocks', 'test.matchers', 'arch.api-error', 'fetch.error-handling'],
  files: ['errorClient.test.ts'],
  hints: [
    'Başarısız cevaptan çağırana hangi iki katmanın bilgisinin ulaşması gerektiğini ayır.',
    '`vi.fn` ile sahte fetch kur; `Response.json` kullanarak 404 ve TMDB’nin `status_code: 34` cevabını döndür.',
    '`await expect(...).rejects.toMatchObject(...)` kullan.',
    'HTTP status 404, TMDB statusCode 34 ve mesajı birlikte sınayacak.',
  ],
  testWriting: {
    mutants: [
      { id: 'generic-error', label: 'API hata ayrıntılarını kaybeden sürüm' },
      { id: 'status-mixup', label: 'HTTP ve TMDB durum kodlarını karıştıran sürüm' },
    ],
  },
})
