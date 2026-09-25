import { defineQuestion } from '@rm/content/define'

export default defineQuestion({
  type: 'code',
  title: 'unknown JSON başlığını oku',
  difficulty: 'kolay',
  concepts: ['ts.unknown-any', 'ts.narrowing'],
  files: ['readMovieTitle.ts'],
  hints: [
    'unknown değeri doğrudan okuyamazsın.',
    'Önce nesne/null ve `title in raw` kontrolü yap.',
    '`typeof raw.title === "string"` ise başlığı döndür.',
  ],
})
