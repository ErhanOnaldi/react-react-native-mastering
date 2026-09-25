import { defineQuestion } from '@rm/content/define'

export default defineQuestion({
  type: 'code',
  title: 'Liste commit sayacı',
  difficulty: 'orta',
  concepts: ['perf.rerender', 'react.components', 'test.mocks'],
  files: ['ProfiledMovies.tsx'],
  preview: { entry: 'Preview.tsx' },
  hints: [
    'Önce yalnız liste ağacını hangi React bileşeniyle ölçebileceğini düşün.',
    '`Profiler` bileşeni `id` ve `onRender` alır.',
    '`<Profiler id="movie-list" onRender={onCommit}>` içine mevcut `ul` öğesini yerleştir.',
  ],
})
