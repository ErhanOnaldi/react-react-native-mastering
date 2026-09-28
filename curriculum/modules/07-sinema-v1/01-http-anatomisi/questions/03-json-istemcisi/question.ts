import { defineQuestion } from '@rm/content/define'

export default defineQuestion({
  type: 'code',
  title: 'JSON cevabını ve HTTP hatasını ayır',
  difficulty: 'orta',
  concepts: ['web.http-anatomy', 'fetch.error-handling'],
  files: ['fetchJson.ts'],
  hints: [
    'Ağ hatası ile sunucudan gelen başarısız HTTP cevabı farklı yollardan gelir. Önce Response durumuna bak.',
    '`response.ok`, `response.status` ve gövdesiz başarı için `response.status === 204` kullan.',
    'Önce `const response = await fetch(url, init)`; başarısızsa `throw new HttpError(response.status)`; 204 ise `return null`; diğer başarıda JSON gövdesini bir kez oku.',
  ],
})
