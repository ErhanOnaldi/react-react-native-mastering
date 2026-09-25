import { defineQuestion } from '@rm/content/define'

export default defineQuestion({
  type: 'quiz',
  title: 'satisfies farkı',
  difficulty: 'kolay',
  concepts: ['ts.satisfies', 'ts.as-const'],
  question: '`as const satisfies Record<GenreId, string>` neden kullanılır?',
  options: [
    {
      text: 'Anahtarları denetler, literal değerlerin çıkarımını korur.',
      correct: true,
      explanation: 'Doğru; biçim kontrolü ve dar değer tipleri birlikte kalır.',
    },
    {
      text: 'Ağdan gelen JSON’u doğrular.',
      explanation: 'satisfies yalnızca kaynak kodundaki ifadenin tipini denetler.',
    },
    {
      text: 'Nesneyi çalışma zamanında dondurur.',
      explanation: 'as const derleme zamanı readonly bilgisidir; Object.freeze değildir.',
    },
  ],
})
