import { defineQuestion } from '@rm/content/define'

export default defineQuestion({
  type: 'quiz',
  title: 'satisfies farkı',
  difficulty: 'kolay',
  concepts: ['ts.satisfies', 'ts.as-const'],
  question: `Aşağıdaki tanımda iki bölüm hangi işi yapar?

\`\`\`ts
type Genre = 'drama' | 'comedy'
const COLORS = { drama: 'rose', comedy: 'amber' } as const satisfies Record<Genre, string>
\`\`\``,
  options: [
    {
      text: 'Eksik/fazla anahtarı yakalar; değerlerin literal tipini korur.',
      correct: true,
      explanation: 'Doğru; biçim kontrolü ve dar değer tipleri birlikte kalır.',
    },
    {
      text: '`COLORS` değişkeninin tipi genel olarak `Record<Genre, string>` olur.',
      explanation: 'Bu bir type annotation gibi davranmaz; `as const` ile literal tipler korunur.',
    },
    {
      text: 'Yeni bir Genre üyesi eklenince COLORS kendiliğinden ona renk verir.',
      explanation:
        'Yeni anahtar eklenirse tabloyu da güncellemelisin; satisfies yalnızca mevcut tanımı denetler.',
    },
  ],
})
