import { defineQuestion } from '@rm/content/define'

export default defineQuestion({
  type: 'project',
  title: 'App’te arama ve favoriler',
  difficulty: 'orta',
  concepts: [
    'react.lifting-state',
    'react.immutability',
    'react.controlled-input',
    'react.lists-keys',
    'js.array-methods',
  ],
  project: 'sinema',
  focusFiles: ['src/App.tsx', 'src/components/MovieGrid.tsx', 'src/components/SearchBox.tsx'],
  hints: [
    'Önce dosya yolları ve export adlarını sözleşmeyle eşleştir; fixture’daki gerçek film verisini kullan.',
    'State’i yalnız ortak üst bileşende tut; bileşenler değeri props ile alıp olayı callback ile bildirsin.',
    'Listeyi `filter` ile türet, favorileri `setFavoriteIds(ids => ...)` ile yeni dizi döndürerek değiştir.',
  ],
})
