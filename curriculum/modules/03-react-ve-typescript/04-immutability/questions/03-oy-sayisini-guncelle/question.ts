import { defineQuestion } from '@rm/content/define'

export default defineQuestion({
  type: 'code',
  title: 'Oy sayısını güncelle',
  difficulty: 'kolay',
  concepts: ['react.immutability', 'js.array-methods', 'js.spread'],
  files: ['VoteBoard.tsx'],
  hints: [
    'Bu kez değişen şey yalnız dizi değil, içindeki film nesnesi.',
    'Eski filmleri `map` ile dolaş; yalnız id’si eşleşeni yeni nesne yap.',
    'Eşleşen dalda `{ ...movie, vote_count: movie.vote_count + 1 }` döndür.',
  ],
})
