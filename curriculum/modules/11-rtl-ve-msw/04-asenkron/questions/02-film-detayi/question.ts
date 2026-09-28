import { defineQuestion } from '@rm/content/define'

export default defineQuestion({
  type: 'code',
  title: 'Asenkron film detayı bileşeni',
  difficulty: 'orta',
  concepts: ['test.async', 'test.msw', 'fetch.loading-states', 'ts.union'],
  files: ['MovieTitle.tsx'],
  hints: [
    'Hangi üç kullanıcı durumunun görüneceğini ve film id değişince neyin yenileneceğini belirle.',
    '`useEffect`, `fetch`, `response.ok` ve ayrı loading/error/data state’leri kullan.',
    'Effect’e ait `active` bayrağını cleanup’ta kapat; yalnız geçerli isteğin cevabını state’e yaz.',
  ],
})
