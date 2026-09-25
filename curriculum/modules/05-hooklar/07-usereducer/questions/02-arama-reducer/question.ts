import { defineQuestion } from '@rm/content/define'
export default defineQuestion({
  type: 'code',
  title: 'Arama reducer geçişleri',
  difficulty: 'orta',
  concepts: ['react.useReducer', 'ts.discriminated-union', 'ts.exhaustive-check'],
  files: ['searchReducer.ts'],
  hints: [
    'Her action için `switch(action.type)` dalı kur.',
    'Yeni state’i `...state` ile immutable döndür.',
    'Action’ın kendine özgü alanı yalnızca ilgili case içinde görünür; default’ta `never` ile kapsam kontrolü yap.',
  ],
})
