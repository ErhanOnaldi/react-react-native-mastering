import { defineQuestion } from '@rm/content/define'
export default defineQuestion({
  type: 'code',
  title: 'Debounced arama akışı',
  difficulty: 'orta',
  concepts: [
    'react.custom-hooks',
    'react.useReducer',
    'react.useEffect.cleanup',
    'react.abort-controller',
  ],
  files: ['useMovieSearch.ts'],
  hints: [
    'Timer için ayrı effect ve cleanup kur.',
    'Ağ effect’inin dependency’si gecikmiş query; her çalışmada yeni controller oluştur.',
    'Reducer saf kalsın: yalnızca action’dan SearchState üretir.',
  ],
})
