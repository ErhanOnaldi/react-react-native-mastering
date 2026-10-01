import { defineQuestion } from '@rm/content/define'

export default defineQuestion({
  type: 'code',
  title: 'Id gelince başlat',
  difficulty: 'orta',
  concepts: ['query.dependent', 'ts.narrowing', 'react.custom-hooks'],
  files: ['useOptionalMovie.ts'],
  hints: [
    'Id undefined iken geçersiz URL üretmeden query’nin beklemesini sağla.',
    '`enabled: id !== undefined` ile sorguyu kapat; query function içinde id’nin bulunduğunu ayrıca kontrol et.',
    'Query function içinde `if (id === undefined) throw new Error(...)` dalı kur; sayı olduğunda fetch et.',
  ],
})
