import { defineQuestion } from '@rm/content/define'

export default defineQuestion({
  type: 'code',
  title: 'Arama isteği sözleşmesini test et',
  difficulty: 'orta',
  concepts: [
    'test.mocks',
    'fetch.query-params',
    'fetch.headers-auth',
    'arch.api-client',
    'test.matchers',
  ],
  files: ['searchMovies.test.ts'],
  hints: [
    'Dolu arama ile boş sorguda beklenen dış etkilerin farklı olup olmadığını belirle.',
    '`vi.fn` ile film listesi cevabı döndür; `fetch` çağrısının URL’sini çöz.',
    '`query`, `page`, `language` parametrelerini ve Bearer başlığını denetle.',
    'Başlığın `Dövüş Kulübü` geldiğini de kontrol et; boş sorgu ayrı testte hiç istek atmamalı.',
  ],
  testWriting: {
    mutants: [
      { id: 'page-lost', label: 'arama isteğinde sayfayı kaybeden sürüm' },
      { id: 'blank-fetch', label: 'boş aramada gereksiz istek atan sürüm' },
      { id: 'auth-lost', label: 'arama isteğini yetkisiz gönderen sürüm' },
    ],
  },
})
