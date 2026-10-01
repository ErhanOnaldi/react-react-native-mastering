import { defineQuestion } from '@rm/content/define'

export default defineQuestion({
  type: 'quiz',
  title: 'Pick mi, Omit mi?',
  difficulty: 'orta',
  concepts: ['ts.pick', 'ts.omit', 'ts.object-types'],
  question: `Film kartı bugün \`Movie\`'nin 14 alanından yalnızca dördünü kullanıyor: \`id\`, \`title\`, \`poster_path\`, \`vote_average\`. İleride \`Movie\`'ye yeni alanlar eklenecek. Bu alanların kartın tipine **kendiliğinden eklenmesini istemiyorsun**; kart ne gösteriyorsa tipi de onu anlatmalı.

Kartın tipi için en uygun tanım hangisi?`,
  options: [
    {
      text: "`Pick<Movie, 'id' | 'title' | 'poster_path' | 'vote_average'>`",
      correct: true,
      explanation:
        "Doğru. `Pick` yalnızca adını verdiğin alanları alır. `Movie`'ye eklenen yeni bir alan seçilenler arasında olmadığı için kartın tipine girmez.",
    },
    {
      text: "Kalan 10 alanı sayan bir `Omit<Movie, 'original_title' | 'overview' | …>`",
      explanation:
        'Bugün aynı dört alanı verir, ama `Omit` "bunlar hariç hepsi" der. `Movie`\'ye eklenen her yeni alan hariç tutulanlar listesinde olmadığı için kartın tipine kendiliğinden girer. İstediğinin tam tersi.',
    },
    {
      text: '`Movie`',
      explanation:
        'Çalışır ama kart kullanmadığı 10 alanı da ister. Kartı denemek için 14 alanlık nesne yazman gerekir; yeni alanlar da kendiliğinden eklenir.',
    },
    {
      text: '`Partial<Movie>`',
      explanation:
        '`Partial` alan seçmez; 14 alanın hepsini isteğe bağlı yapar. Kart `title` olmadan da çağrılabilir hale gelir ve ekranda `undefined` görebilirsin.',
    },
  ],
  explanation:
    'Seçimi şu soru belirler: "İleride eklenecek bir alan bu tipte olmalı mı?" Evetse `Omit` (ör. form taslağı), hayırsa `Pick` (ör. yalnızca belirli alanları gösteren kart).',
})
