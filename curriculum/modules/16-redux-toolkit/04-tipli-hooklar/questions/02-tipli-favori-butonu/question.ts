import { defineQuestion } from '@rm/content/define'
export default defineQuestion({
  type: 'code',
  title: 'Tipli favori butonu',
  difficulty: 'orta',
  concepts: ['redux.typed-hooks', 'react.events', 'perf.rerender'],
  files: ['FavoriteButton.tsx'],
  hints: [
    'Bu düğmenin görünümü tek bir soruya dayanır: verilen kimlik seçili mi?',
    'Tipli `useAppSelector` ve `useAppDispatch` hook’larını kullan; boolean seçimi diğer state değişimlerinden ayrılır.',
    '`state.favorites.ids.includes(id)` sonucuna göre metni `favorite ? "Favoriden çıkar" : "Favorilere ekle"` yap ve tıklamada action gönder.',
  ],
  preview: { entry: 'Preview.tsx' },
})
