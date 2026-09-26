import { defineQuestion } from '@rm/content/define'

export default defineQuestion({
  type: 'project',
  title: 'API client’ı şemayla doğrula',
  difficulty: 'zor',
  concepts: ['zod.api-validation', 'arch.api-client', 'test.msw-overrides'],
  project: 'sinema',
  focusFiles: ['src/shared/api/tmdb-client.ts', 'src/features/movies/api/movies-api.ts'],
  hints: [
    'HTTP başarısı ile gelen JSON’un geçerliliğini ayrı sınırlar olarak düşün.',
    '`response.json()` sonucunu `unknown` alıp şemayla parse et; dönüş tipi için `z.output` kullan.',
    'Bozuk alanda `z.prettifyError` anlaşılır mesaj üretebilir; genre yanıtı için küçük bir şema ekle.',
  ],
  rubric: [
    'Tek kaynaklı ve okunur şema tanımları',
    'Bozuk dış veride açık hata akışı',
    'Mevcut Sinema davranışlarını ve erişilebilirliği koruma',
  ],
})
