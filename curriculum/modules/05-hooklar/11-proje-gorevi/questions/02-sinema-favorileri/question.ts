import { defineQuestion } from '@rm/content/define'
export default defineQuestion({
  type: 'project',
  title: 'Kalıcı favorileri Context ile paylaş',
  difficulty: 'zor',
  concepts: ['react.context', 'react.custom-hooks', 'react.immutability'],
  project: 'sinema',
  rubric: [
    'main.tsx App bileşenini FavoritesProvider ile sarıyor',
    'Kartlar Context üzerinden aynı favori durumunu okuyor',
    'Favoriler yenilemede localStorage üzerinden korunuyor',
  ],
  reviewFiles: ['src/main.tsx', 'src/App.tsx', 'src/context/FavoritesContext.tsx'],
  focusFiles: ['src/context/FavoritesContext.tsx', 'src/main.tsx', 'src/App.tsx'],
  hints: [
    'Önce `useLocalStorage<number[]>` ile provider içindeki id listesini tut.',
    'Context varsayılanını `null` yap, hook’ta kontrol et.',
    '`toggleFavorite` önceki diziye göre `filter` veya spread ile yeni dizi döndürsün.',
  ],
})
