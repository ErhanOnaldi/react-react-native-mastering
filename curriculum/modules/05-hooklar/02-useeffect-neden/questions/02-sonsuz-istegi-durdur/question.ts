import { defineQuestion } from '@rm/content/define'
export default defineQuestion({
  type: 'code',
  title: 'Sonsuz film isteğini durdur',
  difficulty: 'orta',
  concepts: ['react.useEffect', 'react.render-cycle', 'fetch.headers-auth'],
  files: ['MovieTitle.tsx'],
  hints: [
    'Her render’da çalışan satırları bul.',
    '`useEffect` import et ve fetch zincirini effect içine taşı.',
    'Bu ilk sabit gösterimde effect’i `[]` ile kur; başlığı state’ten render et.',
  ],
  preview: { entry: 'Preview.tsx' },
})
