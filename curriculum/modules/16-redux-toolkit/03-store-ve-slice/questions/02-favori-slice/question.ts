import { defineQuestion } from '@rm/content/define'
export default defineQuestion({
  type: 'code',
  title: 'Favori kuralını slice’a taşı',
  difficulty: 'orta',
  concepts: ['redux.slice', 'react.immutability'],
  files: ['favorites.ts'],
  hints: [
    'Slice; başlangıç state’ini, olayı karşılayan reducer’ı ve state’i okuyan selector’ı bir arada tutar.',
    '`createSlice` içinde başlangıçta boş `ids` dizisi, `toggleFavorite` reducer’ı ve `selectFavoriteIds` selector’ı tanımla.',
    'Reducer’da `indexOf` ile ID’yi bul; yoksa `push`, varsa `splice` kullan. Ardından slice, action ve selector export’larını ver.',
  ],
})
