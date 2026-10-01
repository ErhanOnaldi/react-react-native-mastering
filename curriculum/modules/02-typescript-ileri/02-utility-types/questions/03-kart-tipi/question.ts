import { defineQuestion } from '@rm/content/define'

export default defineQuestion({
  type: 'code',
  title: 'Kartın tipini filmden türet',
  difficulty: 'kolay',
  concepts: ['ts.pick', 'ts.optional-nullable', 'ts.narrowing', 'js.array-methods'],
  files: ['task.ts'],
  hints: [
    "`cardLines` satırındaki hatanın en alttaki satırlarını oku: hangi alan `Movie` ile uyuşmuyor? Kart tipi elle yazıldığı için `Movie`'yle arasında bir bağ yok.",
    "Kart tipini elle yazmak yerine `Pick` ile `Movie`'den seç. Alanların tipleri `Movie`'den gelir.",
    "`export type MovieCardData = Pick<Movie, 'id' | 'title' | 'poster_path' | 'vote_average'>` yaz. Sonra `cardLine` içinde `movie.poster_path === null` ise satırın sonuna ` · poster yok` ekle.",
    '`cardLines` içinde hatayı `?? \'\'` ya da `as` ile susturma. Posteri olmayan film kartta "poster yok" diye görünmeli.',
  ],
})
