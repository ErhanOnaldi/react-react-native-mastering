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
    'Hangi sonuçlar gerçekten DOM’da olmalı? Inputun güncel kalması için liste işini nasıl erteleyebilirsin?',
    '`useVirtualizer` ile filtrelenmiş diziyi sanallaştır; scroll container ref, getTotalSize ve satır başlangıçlarını kullan.',
    'SearchPage inputu güncel sorguyla kalsın; listeye `useDeferredValue(query)` ver. Virtualizer count değerini filtreli diziye bağla.',
  ],
  rubric: [
    'Liste gerçek arama sonuçlarıyla bağlanmış, URL ve Query cache akışı korunmuş.',
    'Profiler ile önce ve sonra commit sayısı gözlemlenmiş.',
    'Film id key olarak kullanılmış; boş ve tek sonuç durumu çalışıyor.',
  ],
})
