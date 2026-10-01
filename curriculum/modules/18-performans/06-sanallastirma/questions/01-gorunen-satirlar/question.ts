import { defineQuestion } from '@rm/content/define'

export default defineQuestion({
  type: 'code',
  title: 'Görünür film satırları',
  difficulty: 'orta',
  concepts: ['perf.virtualization', 'react.lists-keys'],
  files: ['VirtualMovies.tsx'],
  preview: { entry: 'Preview.tsx' },
  hints: [
    'Tüm öğeleri `movies.map` ile bir kerede DOM’a basmak yerine, sadece görünür kaydırma aralığını hesaplayan bir sanallaştırma kancası kullanmalısın.',
    '`@tanstack/react-virtual` paketinden `useVirtualizer` hook’unu kullanarak kaydırma kapsayıcısının referansını ve satır ölçülerini tanımla.',
    '`useVirtualizer({ count: movies.length, getScrollElement: () => parentRef.current, estimateSize: () => 40, overscan: 3, getItemKey: (i) => movies[i].id })` ayarlarını yap.',
    'İlk önizleme ölçüsünü 320 × 240 px ver. İç alana `role="list"` ve `height: virtualizer.getTotalSize()` ver; satırları `virtualizer.getVirtualItems()` üzerinden dönerek `position: \'absolute\'` ve `transform: translateY(${row.start}px)` ile konumlandır.',
  ],
})
