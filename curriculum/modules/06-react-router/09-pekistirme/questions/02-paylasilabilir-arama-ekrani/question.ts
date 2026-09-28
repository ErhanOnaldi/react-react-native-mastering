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
    "Input, tür seçimi, görünür sayfa ve listeyi her render URL'den nasıl türeteceğini belirle; filtrelenmiş listeyi state'e kopyalama.",
    "`useSearchParams` ile q, genre ve page'i oku; önce filtrele, sonra `slice` ile sayfayı ayır.",
    "Setter callback içinde `new URLSearchParams(previous)` ile kopyala. Input veya select değişince page'i sil, sonraki sayfada yalnız page değerini değiştir.",
  ],
})
