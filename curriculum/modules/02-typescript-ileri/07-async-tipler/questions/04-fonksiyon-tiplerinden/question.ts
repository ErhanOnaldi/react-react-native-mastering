import { defineQuestion } from '@rm/content/define'

export default defineQuestion({
  type: 'code',
  title: 'Promise sonucunu adlandır',
  difficulty: 'orta',
  concepts: ['ts.async-types', 'ts.generics'],
  files: ['task.ts'],
  hints: [
    'Önce filmin şeklini tanımla; sonra bu filmin gelecekte döneceği Promise tipini adlandır.',
    '`Promise<Movie>` başarıyla çözüldüğünde Movie verir; `Awaited` bu Promise katmanını tipten açar.',
    '`MoviePromise = Promise<Movie>` ve `LoadedMovie = Awaited<MoviePromise>` tiplerini yaz; `movieLabel` içinde başlıkla ID’yi kullan.',
  ],
})
