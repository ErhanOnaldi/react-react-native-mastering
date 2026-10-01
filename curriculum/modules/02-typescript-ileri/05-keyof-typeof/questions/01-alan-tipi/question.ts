import { defineQuestion } from '@rm/content/define'

export default defineQuestion({
  type: 'quiz',
  title: 'Anahtar mı değer mi?',
  difficulty: 'kolay',
  concepts: ['ts.indexed-access', 'ts.object-types'],
  question: `Bu tiplerin sonucunda \`GenreIds\` nedir?

\`\`\`ts
type Movie = { id: number; title: string; genre_ids: number[] }
type GenreIds = Movie['genre_ids']
\`\`\``,
  options: [
    {
      text: '`number[]`',
      correct: true,
      explanation: "Movie['genre_ids'] alanın değer tipini alır; bu alan sayı dizisidir.",
    },
    {
      text: '`"genre_ids"`',
      explanation:
        'Anahtar literalini `keyof` union içinden seçersin; köşeli erişim değer tipini verir.',
    },
    {
      text: '`number | string | number[]`',
      explanation:
        'Bu, Movie[keyof Movie] gibi tüm alanların değer tiplerini birleştirirdi; burada yalnız genre_ids seçildi.',
    },
    {
      text: 'Film nesnesindeki gerçek ID dizisi.',
      explanation: 'Bu kod yalnızca bir tip tanımlar; çalışma zamanındaki film değerini okumaz.',
    },
  ],
})
