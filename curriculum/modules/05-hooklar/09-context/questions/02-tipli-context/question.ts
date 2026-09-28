import { defineQuestion } from '@rm/content/define'
export default defineQuestion({
  type: 'code',
  title: 'Provider sınırını kur',
  difficulty: 'orta',
  concepts: ['react.context', 'react.custom-hooks', 'ts.optional-nullable'],
  files: ['FavoritesContext.tsx'],
  hints: [
    'Provider yokken boş dizi dönmek hatayı gizler; yanlış yerleşimi görünür yap.',
    'Context varsayılanı `null` olmalı; provider `value` ile `[550]` listesini verir.',
    'Hook `useContext` sonucunu kontrol edip null ise `FavoritesProvider` geçen bir hata fırlatır.',
  ],
})
