import { defineQuestion } from '@rm/content/define'
export default defineQuestion({
  type: 'code',
  title: 'Guest session ile gerçek POST',
  difficulty: 'orta',
  concepts: ['query.useMutation', 'fetch.headers-auth', 'fetch.error-handling'],
  files: ['ratingApi.ts'],
  hints: [
    'Önce session id’yi localStorage’dan oku.',
    'İki fetch için de Bearer başlığı ve response.ok kontrolü ekle.',
    'POST gövdesi JSON.stringify({ value }); session id query parametresinde.',
  ],
})
