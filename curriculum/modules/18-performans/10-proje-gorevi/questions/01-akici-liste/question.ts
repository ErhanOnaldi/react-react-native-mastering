import { defineQuestion } from '@rm/content/define'

export default defineQuestion({
  type: 'project',
  title: 'Sinema aramasını akıcılaştır',
  difficulty: 'zor',
  concepts: ['perf.virtualization', 'perf.transitions', 'react.controlled-input', 'query.keys'],
  project: 'sinema',
  focusFiles: ['src/features/movies/components/VirtualMovieList.tsx', 'src/pages/SearchPage.tsx'],
  reviewFiles: ['src/features/movies/components/VirtualMovieList.tsx', 'src/pages/SearchPage.tsx'],
  hints: [
    'Önce aynı veriye filtre uygula, sonra virtualizer count değerini filtreli diziye bağla.',
    '`getScrollElement` için scroll container ref kullan; `getTotalSize` ve virtual row start değerlerini yerleştir.',
    'SearchPage inputu güncel sorguyla kalsın; listeye `useDeferredValue(query)` ver.',
  ],
  rubric: [
    'Liste gerçek arama sonuçlarıyla bağlanmış, URL ve Query cache akışı korunmuş.',
    'Profiler ile önce ve sonra commit sayısı gözlemlenmiş.',
    'Film id key olarak kullanılmış; boş ve tek sonuç durumu çalışıyor.',
  ],
})
