import { defineQuestion } from '@rm/content/define'

export default defineQuestion({
  type: 'code',
  title: 'Konuma göre optimize edilen film afişi',
  difficulty: 'orta',
  concepts: ['perf.asset-delivery', 'perf.web-vitals'],
  files: ['MoviePoster.tsx'],
  hints: [
    'Öncelikli (priority) bir görsel ilk ekranda LCP adayıdır; bu yüzden ertelenmemeli ve tarayıcıya yüksek öncelikle indirmesi söylenmelidir.',
    '`priority` true ise `loading="eager"` ve `fetchPriority="high"` ver. `priority` verilmemiş veya false ise `loading="lazy"` ver.',
    'Her durumda `decoding="async"`, `width`, `height`, `src`, `alt` ve varsa `className` özniteliklerini `<img>` öğesine aktar.',
  ],
})
