import { defineQuestion } from '@rm/content/define'

export default defineQuestion({
  type: 'code',
  title: 'Kartın küçük tipini türet',
  difficulty: 'orta',
  concepts: ['ts.pick', 'ts.object-types', 'ts.optional-nullable'],
  files: ['task.ts'],
  hints: [
    'Kartın ihtiyaç duyduğu alanları temel nesne tipinden seç; alan kopyası yazma.',
    '`Pick<Movie, ...>` ile `MovieCardData` tipini türet.',
    '`poster_path === null` koşulunda ek etiket, diğer durumda başlık dön.',
  ],
})
