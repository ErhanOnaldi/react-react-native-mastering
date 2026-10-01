import { defineQuestion } from '@rm/content/define'

export default defineQuestion({
  type: 'code',
  title: 'Arama API’sini incelt',
  difficulty: 'zor',
  concepts: [
    'arch.refactoring',
    'arch.api-client',
    'fetch.headers-auth',
    'fetch.query-params',
    'ts.api-types',
  ],
  files: ['searchMovies.ts', 'buildSearchUrl.ts'],
  hints: [
    'Önce `buildSearchUrl` içinde `language`, `query` ve `page` değerleriyle tam adresi üret.',
    '`searchMovies` tek fetch çağrı yolunu kullansın ve URL kurucusunu çağırsın; `undefined` değeri string yapma.',
  ],
  rubric: [
    '`buildSearchUrl` URL API kullanarak Türkçe arama ve sayfa değerlerini kodlar.',
    '`searchMovies` bir kez fetch çağırır ve ayrılan URL kurucusunu gerçekten kullanır.',
    'Bearer başlığı, Türkçe karakterler ve istenen sayfa korunur.',
    'İlk sayfa ve sonraki sayfalar aynı istek yolundan geçer.',
  ],
})
