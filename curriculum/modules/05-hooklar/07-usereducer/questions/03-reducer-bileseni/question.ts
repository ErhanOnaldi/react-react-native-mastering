import { defineQuestion } from '@rm/content/define'
export default defineQuestion({
  type: 'code',
  title: 'Reducer ile sonuç ekranı',
  difficulty: 'orta',
  concepts: ['react.useReducer', 'react.events', 'react.conditional-rendering', 'ts.union'],
  files: ['ResultPanel.tsx'],
  hints: [
    'Eylemler `start` ve `done` olabilir.',
    'Reducer her dalda yeni state dönsün.',
    'Düğmeler `dispatch` çağırır; görüntü `state.status` üzerinden belirlenir.',
  ],
})
