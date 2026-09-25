import { defineQuestion } from '@rm/content/define'

export default defineQuestion({
  type: 'project',
  title: 'TMDB yardımcısını yaz',
  difficulty: 'orta',
  concepts: ['fetch.headers-auth', 'fetch.error-handling', 'fetch.query-params', 'ts.generics'],
  project: 'sinema',
  focusFiles: ['src/lib/tmdb.ts'],
  reviewFiles: ['src/lib/tmdb.ts'],
  rubric: [
    'Bearer token ve Türkçe dil tek merkezde',
    'HTTP hatası başarısız Promise olarak aktarılıyor',
  ],
  hints: [
    '`buildTmdbUrl` fikrini projeye taşı; taban URL’yi named export et.',
    '`fetch` çağrısında Authorization başlığı ekle, `response.ok` kontrol et.',
    '`!response.ok` ise `{ status_message }` gövdesini okumayı dene; yoksa HTTP status ile Error oluştur.',
  ],
})
