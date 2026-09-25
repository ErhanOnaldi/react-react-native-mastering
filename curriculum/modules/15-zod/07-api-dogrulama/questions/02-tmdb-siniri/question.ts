import { defineQuestion } from '@rm/content/define'

export default defineQuestion({
  type: 'code',
  title: 'TMDB yanıtını sınırda doğrula',
  difficulty: 'orta',
  concepts: ['zod.api-validation', 'arch.api-client', 'test.msw-overrides'],
  files: ['client.ts'],
  hints: [
    '200 durumunun veri şekli garantisi olmadığını testteki null başlıkla gör.',
    '`response.ok` kontrolünden sonra JSON’u `unknown` al; başlık şemasıyla parse et.',
    'İstekte Bearer başlığını koru; başarısız HTTP için durumlu Error, bozuk JSON için `schema.parse(raw)` kullan.',
  ],
})
