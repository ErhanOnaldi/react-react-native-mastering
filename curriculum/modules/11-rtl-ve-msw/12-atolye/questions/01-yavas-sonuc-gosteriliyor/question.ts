import { defineQuestion } from '@rm/content/define'

export default defineQuestion({
  type: 'code',
  title: 'Yavaş sonuç gösteriliyor',
  difficulty: 'orta',
  concepts: ['react.race-conditions', 'react.useEffect.cleanup', 'test.msw-overrides'],
  files: ['MovieSearch.tsx'],
  preview: { entry: 'Preview.tsx' },
  hints: [
    'Boş alanın hangi sonuç ve istek davranışını gerektirdiğini ayır.',
    'Devam eden isteğin cevabı artık güncel ekran için geçerli olmayabilir.',
    'Her arama değişiminde eski isteği geçersiz kıl; boş metinde listeyi temizle ve yeni istek başlatma.',
  ],
})
