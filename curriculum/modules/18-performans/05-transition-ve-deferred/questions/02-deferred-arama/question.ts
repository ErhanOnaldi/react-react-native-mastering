import { defineQuestion } from '@rm/content/define'

export default defineQuestion({
  type: 'code',
  title: 'Güncel input, ertelenen sonuç',
  difficulty: 'orta',
  concepts: ['perf.transitions', 'react.controlled-input', 'react.derived-state'],
  files: ['DeferredSearch.tsx'],
  preview: { entry: 'Preview.tsx' },
  hints: [
    'Kullanıcının doğrudan yazdığı arama değeri ile listenin süzülmesinde kullanılan değeri birbirinden ayırmalısın.',
    'Bir değerin daha düşük öncelikle işlenmesini sağlamak ve eski değeri yeni render yetişene kadar korumak için `useDeferredValue` hook’u kullanılır.',
    '`const deferredQuery = useDeferredValue(query)` ile ertelenmiş sorguyu al; listeyi bu değerle filtrele.',
    '`query !== deferredQuery` olduğunda `<p>Liste güncelleniyor</p>` göster; böylece kullanıcıya arayüzün çalıştığı dürüstçe hissettirilir.',
  ],
})
