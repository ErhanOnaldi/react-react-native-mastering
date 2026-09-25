import { defineQuestion } from '@rm/content/define'
export default defineQuestion({
  type: 'code',
  title: 'Tipli favori butonu',
  difficulty: 'orta',
  concepts: ['redux.typed-hooks', 'react.events', 'perf.rerender'],
  files: ['FavoriteButton.tsx'],
  hints: [
    '`useAppSelector` ile yalnız gereken boolean değeri seç.',
    '`state.favorites.ids.includes(id)` yeterli.',
    'Metni `favorite ? "Favoriden çıkar" : "Favorilere ekle"` ile üret.',
  ],
  preview: { entry: 'Preview.tsx' },
})
