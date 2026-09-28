import { defineQuestion } from '@rm/content/define'

export default defineQuestion({
  type: 'code',
  title: 'Loading ve hata durumuna test yaz',
  difficulty: 'orta',
  concepts: ['test.async', 'test.msw-overrides', 'fetch.loading-states'],
  files: ['MovieStatus.test.tsx'],
  hints: [
    'Başlangıçta hemen görünen durumu ve response’tan sonra gelen durumu ayrı düşün.',
    'MSW override’ında `http.get`, `HttpResponse.json` ve `await delay(...)` kullan.',
    'Hemen görünen loading için `getByRole`, sonradan gelen başlık ve alert için `findByRole` yaz; 500 cevabını özel handler ile üret.',
    '`@test-utils` içinden `server`, `http`, `HttpResponse`, `delay` ve `TMDB_BASE` import edebilirsin.',
  ],
  testWriting: {
    mutants: [
      { id: 'no-loading', label: 'istek sırasında durum göstermeyen sürüm' },
      { id: 'swallow-error', label: 'HTTP hatasını sessizce yutan sürüm' },
    ],
  },
})
