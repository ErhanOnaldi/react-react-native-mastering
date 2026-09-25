import { defineQuestion } from '@rm/content/define'
export default defineQuestion({
  type: 'code',
  title: 'Provider sınırını kur',
  difficulty: 'orta',
  concepts: ['react.context', 'react.custom-hooks', 'ts.optional-nullable'],
  files: ['FavoritesContext.tsx'],
  hints: [
    'Context varsayılanı `null` olmalı.',
    'Provider `value` ile id listesini verir.',
    'Hook `useContext` sonucunu kontrol edip null ise hata fırlatır.',
  ],
})
