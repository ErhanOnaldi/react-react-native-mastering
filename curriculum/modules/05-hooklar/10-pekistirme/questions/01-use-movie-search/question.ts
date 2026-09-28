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
    'Bu hook’ta zaman gecikmesi ve ağ isteği iki ayrı dış sistemdir.',
    'Timer için ayrı effect ve cleanup kur; ağ effect’inin dependency’si gecikmiş query olsun.',
    'Her ağ çalışmasında yeni AbortController oluştur; boş query’de idle’a dön ve istek atma.',
    'Reducer saf kalsın: yalnızca action’dan `SearchState` üretir.',
  ],
})
