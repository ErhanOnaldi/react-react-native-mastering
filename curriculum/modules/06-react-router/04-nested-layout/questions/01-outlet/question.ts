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
      text: 'Parent route’un `path` değerine `/*` eklemek.',
      explanation:
        'Bu yazım child path’lerin eşleşmesini çözmez; eşleşen child içeriği layout içindeki Outlet konumunda gösterilir.',
    },
    {
      text: 'Layout’ın içine `Arama` başlığını sabit olarak yazmak.',
      explanation:
        'Sabit başlık yalnızca o metni gösterir; adresle eşleşen child içeriği Outlet konumunda görünür.',
    },
  ],
})
