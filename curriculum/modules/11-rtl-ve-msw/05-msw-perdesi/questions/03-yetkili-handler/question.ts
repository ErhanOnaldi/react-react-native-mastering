import { defineQuestion } from '@rm/content/define'

export default defineQuestion({
  type: 'code',
  title: 'MSW ile yetkili film handler’ı',
  difficulty: 'orta',
  concepts: ['test.msw', 'fetch.headers-auth'],
  files: ['filmHandler.ts'],
  hints: [
    'MSW 2 için http.get ve HttpResponse.json kullan.',
    'request.headers.get("Authorization") ile başlığı oku; params.id string’dir.',
    'Önce auth’u, sonra id’yi kontrol et.',
  ],
})
