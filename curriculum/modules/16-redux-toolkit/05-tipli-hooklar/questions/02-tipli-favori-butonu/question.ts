import { defineQuestion } from '@rm/content/define'
export default defineQuestion({
  type: 'code',
  title: 'Tipli favori butonu',
  difficulty: 'orta',
  concepts: ['redux.typed-hooks', 'react.events', 'perf.rerender'],
  files: ['FavoriteButton.tsx'],
  hints: [
    'Önce store tiplerini store’dan türet; sonra React Redux hook’larına bu tipleri bağla.',
    '`.withTypes<RootState>()` selector state’ini, `.withTypes<AppDispatch>()` ise dispatch kabul ettiği action’ları tiplendirir.',
    '`state.favorites.ids.includes(id)` sonucunu seç. Bu boolean’a göre etiketi belirle ve tıklamada `slice.actions.toggle(id)` dispatch et.',
  ],
  rubric: [
    'RootState ve AppDispatch kurulu store’dan türetilmiştir.',
    'useAppSelector ve useAppDispatch .withTypes ile tanımlanıp export edilmiştir.',
    'FavoriteButton yalnızca ilgili ID’nin seçili olup olmadığını okur.',
    'Tıklama action’ı gerçek store’a gönderir ve tema tüketicisini gereksiz render etmez.',
  ],
  preview: { entry: 'Preview.tsx' },
})
