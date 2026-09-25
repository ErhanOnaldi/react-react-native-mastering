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
    'İki dalın testleri baştan geçiyor; önce bunu gör.',
    'Sayfa değeri yalnız parametre, ayrı fetch dalı değil.',
    'Tek URL, tek Bearer başlığı, tek fetch ve tek JSON okuma yolu kur.',
  ],
  rubric: [
    'Sayfa 1 ve sonraki sayfalar aynı HTTP akışını kullanır; yalnız parametre değişir.',
    'Bearer, dil ve query tek yerde kurulur; kopya kalmaz.',
    'Dönüş tipi ve mevcut kullanıcı davranışı korunur.',
  ],
})
