import { defineQuestion } from '@rm/content/define'

export default defineQuestion({
  type: 'quiz',
  title: 'Kart verisi ve yerel görünüm seçimi',
  difficulty: 'orta',
  concepts: ['ts.pick', 'shadcn.theming'],
  question:
    'Modül 9’da kart props’unu `Pick` ile daraltmıştın. Temalı kartın veri alanları `title` ve `poster_path`; ayrıca API’de bulunmayan yerel `density: "compact" | "cozy"` görünüm seçimi gerekiyor. Hangi props tipi hem kaynak alanları türetir hem bu seçimi zorunlu tutar?',
  options: [
    {
      text: '`Pick<Movie, "title" | "poster_path"> & { density: "compact" | "cozy" }`',
      correct: true,
      explanation:
        'Doğru. `Pick` API alanlarını kaynak tipten alır; kesişim tipi yalnız karta ait zorunlu görünüm seçimini ekler.',
    },
    {
      text: '`Movie & { density?: string }`',
      correct: false,
      explanation:
        'Tam API modeli kartı kullanmadığı alanlara bağlar; opsiyonel ve serbest string `density` de görünüm sözleşmesini zayıflatır.',
    },
    {
      text: '`Partial<Movie> & { density: string }`',
      correct: false,
      explanation:
        'Bütün API alanları opsiyonel olur ve `density` yalnız iki geçerli değerle sınırlanmaz.',
    },
  ],
})
