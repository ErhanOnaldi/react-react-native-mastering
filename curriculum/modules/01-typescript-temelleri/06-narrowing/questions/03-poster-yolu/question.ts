import { defineQuestion } from '@rm/content/define'

export default defineQuestion({
  type: 'code',
  title: 'Poster yolunu güvenle hazırla',
  difficulty: 'kolay',
  concepts: ['ts.narrowing', 'ts.optional-nullable'],
  files: ['posterPath.ts'],
  hints: [
    '`.startsWith` çağrısından önce null durumundan çık.',
    'Boş string de işe yarar bir yol değildir.',
    "Dolu yolda `startsWith('/')` ile karar ver.",
  ],
})
