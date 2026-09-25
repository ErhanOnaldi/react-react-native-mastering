import { defineQuestion } from '@rm/content/define'

export default defineQuestion({
  type: 'project',
  title: 'Statik film verisi ve bileşenler',
  difficulty: 'orta',
  concepts: ['react.props', 'react.children', 'react.lists-keys', 'ts.pick', 'ts.omit'],
  project: 'sinema',
  focusFiles: [
    'src/data/sample-movies.ts',
    'src/components/MovieCard.tsx',
    'src/components/MovieGrid.tsx',
    'src/components/SearchBox.tsx',
  ],
  hints: [
    'Önce dosya yolları ve export adlarını sözleşmeyle eşleştir; fixture’daki gerçek film verisini kullan.',
    'State’i yalnız ortak üst bileşende tut; bileşenler değeri props ile alıp olayı callback ile bildirsin.',
    'Listeyi `filter` ile türet, favorileri `setFavoriteIds(ids => ...)` ile yeni dizi döndürerek değiştir.',
  ],
})
