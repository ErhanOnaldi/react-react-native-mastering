import { defineQuestion } from '@rm/content/define'

export default defineQuestion({
  type: 'code',
  title: 'Bearer ve ApiError',
  difficulty: 'zor',
  concepts: [
    'arch.api-client',
    'arch.api-error',
    'fetch.headers-auth',
    'fetch.error-handling',
    'ts.generics',
  ],
  files: ['tmdbClient.ts'],
  hints: [
    '`fetch` 404 cevabında reject olmaz; `response.ok` kontrol et.',
    'URL.searchParams ile `language` ve ek parametreleri kur; Bearer başlığını ekle.',
    'Hata JSON’undaki `status_code` ve `status_message` alanlarını oku; `ApiError` örneğinde HTTP status’u da sakla.',
  ],
})
