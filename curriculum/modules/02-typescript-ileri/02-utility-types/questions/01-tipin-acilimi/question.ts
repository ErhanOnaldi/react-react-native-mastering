import { defineQuestion } from '@rm/content/define'

export default defineQuestion({
  type: 'quiz',
  title: 'Bu tip neye açılır?',
  difficulty: 'kolay',
  concepts: ['ts.partial', 'ts.omit', 'ts.optional-nullable'],
  question: `Kullanıcı bir film yorumunu düzenlerken yalnızca puanı ya da metni değiştirebiliyor:

\`\`\`ts
type Review = {
  id: number
  movieId: number
  rating: number
  comment: string | null
}

type ReviewEdit = Partial<Omit<Review, 'id' | 'movieId'>>
\`\`\`

\`ReviewEdit\` neye açılır?`,
  options: [
    {
      text: '`{ rating?: number; comment?: string | null }`',
      correct: true,
      explanation:
        "Doğru. İçten dışa okursun: önce `Omit` `id` ve `movieId`'yi çıkarır, sonra `Partial` kalan iki alanın sonuna `?` ekler. Alan tipleri aynen kalır.",
    },
    {
      text: '`{ rating?: number; comment?: string }`',
      explanation:
        '`Partial` yalnızca `?` ekler, alanın değer tipine dokunmaz. `comment` kaynakta `string | null` olduğu için burada da `string | null` kalır.',
    },
    {
      text: '`{ id?: number; movieId?: number; rating?: number; comment?: string | null }`',
      explanation:
        "Bu, `Omit` adımı atlanmış hali. İç içe ifadede en içteki `Omit` önce uygulanır; `id` ve `movieId` daha `Partial`'a gelmeden listeden çıkar.",
    },
    {
      text: '`{ rating: number; comment: string | null }`',
      explanation:
        "Bu, yalnızca `Omit<Review, 'id' | 'movieId'>` sonucudur. Dıştaki `Partial` adımı unutulmuş; o adım her alanı isteğe bağlı yapar.",
    },
  ],
  explanation:
    'İç içe utility ifadelerini fonksiyon çağrısı gibi içten dışa oku ve her adımda alan listesinin nasıl değiştiğine bak: `Review` (4 alan) → `Omit` (2 alan) → `Partial` (2 isteğe bağlı alan).',
})
