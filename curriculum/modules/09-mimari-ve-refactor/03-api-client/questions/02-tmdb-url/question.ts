import { defineQuestion } from '@rm/content/define'

export default defineQuestion({
  type: 'code',
  title: 'TMDB URL’sini tek yerde kur',
  difficulty: 'orta',
  concepts: ['arch.api-client', 'fetch.query-params', 'ts.record'],
  files: ['buildTmdbUrl.ts'],
  hints: [
    'TMDB kökünü tek sabitte tut.',
    'URL nesnesine `/3` sonrasındaki path’i ekle; `searchParams` kullan.',
    'Önce `language=tr-TR` ekle, sonra `Object.entries(params)` ile tanımlı değerleri string’e çevir.',
  ],
})
