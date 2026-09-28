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
    'İlk ve sonraki sayfada değişen bilgi ne, ortak kalan akış ne?',
    '`URLSearchParams` ile URL üretimini ayır; istek başlığı ve sonucu koru.',
    'Aynı arama fonksiyonu iki sayfada da bir URL ve tek fetch yolundan geçsin.',
    'Türkçe query’yi kodlanmış URL’den tekrar okurken aynı değeri görmelisin.',
  ],
  rubric: [
    'Sayfa 1 ve sonraki sayfalar aynı HTTP akışını kullanır; yalnız parametre değişir.',
    'Bearer, dil ve query tek yerde kurulur; kopya kalmaz.',
    'Dönüş tipi ve mevcut kullanıcı davranışı korunur.',
  ],
})
