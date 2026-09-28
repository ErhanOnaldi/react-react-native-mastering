import { defineQuestion } from '@rm/content/define'

export default defineQuestion({
  type: 'code',
  title: 'Sıralama yavaşlıyor',
  difficulty: 'orta',
  concepts: ['react.derived-state', 'perf.rerender', 'react.lists-keys'],
  files: ['MovieCatalog.tsx'],
  preview: { entry: 'Preview.tsx' },
  hints: [
    'Favori işareti hangi filme ait olduğunu nasıl biliyor? Listedeki konuma göre mi, yoksa filmin kendisine göre mi?',
    'Arama veya sıralama listenin sırasını ya da uzunluğunu değiştirdiğinde, konuma dayanan bir eşleme yanlış öğeye kayar.',
    'Favorileri filmin `id`’siyle tut (ör. bir `Set<number>` veya `Record<number, boolean>`); listedeki her öğeye de konumu değil `id`’sini `key` yap.',
  ],
})
