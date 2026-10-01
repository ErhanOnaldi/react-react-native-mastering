import { defineQuestion } from '@rm/content/define'

export default defineQuestion({
  type: 'code',
  title: 'MSW ile yetkili film handler’ı',
  difficulty: 'orta',
  concepts: ['test.msw', 'fetch.headers-auth'],
  files: ['filmHandler.ts'],
  hints: [
    'Her istek için önce erişim iznini, sonra hangi kaydın istendiğini değerlendir.',
    'MSW 2’de `http.get`, `HttpResponse.json`, `request.headers` ve `params` kullan.',
    'Authorization değerini `Bearer ` öneki ve boş olmayan token için kontrol et; ardından `params.id` değerini `550` ile karşılaştır.',
  ],
})
