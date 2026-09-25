import { defineQuestion } from '@rm/content/define'
export default defineQuestion({
  type: 'code',
  title: 'Slice selector’ı',
  difficulty: 'orta',
  concepts: ['redux.selectors', 'ts.inference'],
  files: ['ui.ts'],
  hints: [
    'Selector slice state’ini alır.',
    '`state.theme` alanını karşılaştır.',
    '`state.theme === "dark"` döndür.',
  ],
})
