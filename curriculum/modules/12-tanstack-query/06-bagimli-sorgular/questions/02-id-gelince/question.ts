import { defineQuestion } from '@rm/content/define'

export default defineQuestion({
  type: 'code',
  title: 'Id gelince başlat',
  difficulty: 'orta',
  concepts: ['query.dependent', 'ts.narrowing', 'react.custom-hooks'],
  files: ['useOptionalMovie.ts'],
  hints: [
    'Id undefined iken geçersiz URL üretmeden query’nin beklemesini sağla.',
    '`skipToken` ile geçerli `queryFn` dalını koşullu seç; hook’u koşullu çağırma.',
    '`id === undefined ? skipToken : () => getMovie(id)` ve fetch içinde Bearer/HTTP kontrolü kullan.',
  ],
})
