import { defineQuestion } from '@rm/content/define'

export default defineQuestion({
  type: 'code',
  title: 'Paylaşılabilir arama sayfası',
  difficulty: 'zor',
  concepts: [
    'router.search-params',
    'react.derived-state',
    'react.controlled-input',
    'js.array-methods',
  ],
  files: ['SearchPage.tsx'],
  hints: [
    'Önce q, genre ve page değerlerini her render’da URL’den oku; filtrelenmiş listeyi state’e kopyalama.',
    'Başlık ve türü filtrele, ardından `slice` ile sayfayı ayır. Input veya select değişiminde page değerini sil.',
    'Parametre güncellemelerinde `new URLSearchParams(previous)` ile kopya al; Sonraki sayfa yalnızca page değerini değiştirsin.',
  ],
})
