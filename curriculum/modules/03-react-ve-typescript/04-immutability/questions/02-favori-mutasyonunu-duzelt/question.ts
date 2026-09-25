import { defineQuestion } from '@rm/content/define'

export default defineQuestion({
  type: 'code',
  title: 'Favori mutasyonunu düzelt',
  difficulty: 'kolay',
  concepts: ['react.immutability', 'react.state', 'js.spread'],
  files: ['FavoriteShelf.tsx'],
  hints: [
    '`push` diziyi yerinde değiştirir; React’e hangi referansı veriyorsun?',
    '`setFavoriteIds` içine eski id dizisini alan updater yaz; ekleme ve çıkarma yollarını ayır.',
    'Varsa `ids.filter(value => value !== id)`, yoksa `[...ids, id]` döndür.',
  ],
  preview: {
    entry: 'Preview.tsx',
  },
})
