import { defineQuestion } from '@rm/content/define'

export default defineQuestion({
  type: 'quiz',
  title: 'Çocuk sayfa neden görünmüyor?',
  difficulty: 'orta',
  concepts: ['router.nested-layouts', 'react.composition'],
  question:
    '`/search` URL’si doğru eşleşiyor; menü görünüyor ama Arama içeriği yok. Layout’ta ne eksik?',
  options: [
    {
      text: '`<Outlet />`.',
      correct: true,
      explanation: 'Doğru. Alt route içeriği Outlet yerinde render edilir.',
    },
    {
      text: 'Her sayfada ayrı `<nav>`.',
      explanation: 'Menüyü çoğaltmak sorunu büyütür; Outlet çocuk içeriği gösterir.',
    },
    {
      text: '`useEffect` içinde `setPage`.',
      explanation: 'URL zaten doğru eşleşmiş; state senkronizasyonuna gerek yok.',
    },
  ],
})
