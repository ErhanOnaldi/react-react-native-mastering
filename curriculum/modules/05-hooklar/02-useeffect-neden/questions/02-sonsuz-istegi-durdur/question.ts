import { defineQuestion } from '@rm/content/define'
export default defineQuestion({
  type: 'code',
  title: 'Sonsuz film isteğini durdur',
  difficulty: 'orta',
  concepts: ['react.useEffect', 'react.render-cycle', 'fetch.headers-auth'],
  files: ['MovieTitle.tsx'],
  hints: [
    'Her render’da çalışan satırları bul.',
    'Ağ isteği render hesabı değil; commit sonrasında çalışan bir effect içinde olmalı.',
    '`useEffect(() => { fetch(...).then(...) }, [id])` iskeletiyle başla; başlığı state’ten render et.',
    'Headers nesnesini effect içinde kurarsan dependency listesine ayrıca nesne eklemek zorunda kalmazsın.',
  ],
  preview: { entry: 'Preview.tsx' },
})
