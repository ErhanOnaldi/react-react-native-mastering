import { defineQuestion } from '@rm/content/define'

export default defineQuestion({
  type: 'code',
  title: 'Yıl etiketindeki yazım hatası',
  difficulty: 'kolay',
  concepts: ['ts.object-types', 'tooling.type-check'],
  files: ['movieYear.ts'],
  hints: [
    'Nesneden tarih alanını okurken boş string durumunu önceden ele almayı düşün.',
    'Boş metin kontrolünü `=== ""` ile yapabilir, dolu metinde ilk dört karakteri `.slice(0, 4)` ile alabilirsin.',
    'Koşul yapısı: `if (movie.release_date === "") return "Tarih yok"; return movie.release_date.slice(0, 4);`',
    '`movie.relese_date` gibi yanlış yazımlardan kaçın; fonksiyon parametresinde sözleşmedeki `release_date` alan adını kullan.',
  ],
})
