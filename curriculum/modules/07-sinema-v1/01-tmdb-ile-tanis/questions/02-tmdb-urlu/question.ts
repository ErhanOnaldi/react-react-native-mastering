import { defineQuestion } from '@rm/content/define'

export default defineQuestion({
  type: 'code',
  title: 'TMDB URL’sini güvenle kur',
  difficulty: 'orta',
  concepts: ['fetch.query-params', 'ts.object-types', 'router.search-params', 'js.destructuring'],
  files: ['buildTmdbUrl.ts'],
  hints: [
    'Önce taban URL ve path ile bir `URL` oluştur; path başındaki `/` iki kez yazılmasın.',
    '`new URLSearchParams({ language: "tr-TR" })` ile başla; `Object.entries(params)` üstünden geç.',
    '`undefined` değerleri atla, kalanları `String(value)` ile `search.set(key, ...)` içine koy; `url.search = search.toString()` ile bitir.',
  ],
})
