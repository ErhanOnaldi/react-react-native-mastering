import { defineQuestion } from '@rm/content/define'
export default defineQuestion({
  type: 'code',
  title: 'Reducer ile sonuç ekranı',
  difficulty: 'orta',
  concepts: ['react.useReducer', 'react.events', 'react.conditional-rendering', 'ts.union'],
  files: ['ResultPanel.tsx'],
  hints: [
    'İki düğme iki olay üretir; ekrandaki metin bu olaylardan sonra oluşan state’e bağlı.',
    '`useReducer` ile `start` ve `done` gibi action’ları ayır.',
    'Reducer her dalda yeni state dönsün; düğmeler `dispatch` çağırır.',
    'Görüntüyü `state.status` ve sonuç sayısı üzerinden seç.',
  ],
})
