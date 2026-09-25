import { defineQuestion } from '@rm/content/define'

export default defineQuestion({
  type: 'code',
  title: 'Film id’sini güvenle daralt',
  difficulty: 'kolay',
  concepts: ['router.params', 'ts.narrowing'],
  files: ['parseMovieId.ts'],
  hints: [
    'Önce `undefined` ve rakam dışı karakterleri ayır.',
    '`/^\\d+$/` biçimini ve `Number.isSafeInteger` sonucunu kontrol et.',
  ],
})
