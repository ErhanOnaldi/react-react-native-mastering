import { defineQuestion } from '@rm/content/define'

export default defineQuestion({
  type: 'code',
  title: 'Liste commit sayacı',
  difficulty: 'orta',
  concepts: ['perf.rerender', 'react.components', 'test.mocks'],
  files: ['ProfiledMovies.tsx'],
  preview: { entry: 'Preview.tsx' },
  hints: [
    'Ekrandaki belirli bir alt ağacın commit aşamalarını React düzeyinde dinleyebilecek yerleşik sarmalayıcıyı düşün.',
    '`Profiler` bileşeni (`id` ve `onRender` propları ile) belirli bir ağacın mount ve update commit’lerini yakalar.',
    '`<Profiler id="movie-list" onRender={onCommit}>` içine mevcut `ul` öğesini yerleştir.',
    'Ölçüm callback’i içinde doğrudan aynı bileşenin state’ini güncellemek sonsuz render döngüsüne yol açabilir; callback doğrudan gelen `onCommit` fonksiyonuna bağlanmalıdır.',
  ],
})
