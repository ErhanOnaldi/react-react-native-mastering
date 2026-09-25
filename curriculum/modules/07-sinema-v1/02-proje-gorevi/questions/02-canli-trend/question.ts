import { defineQuestion } from '@rm/content/define'

export default defineQuestion({
  type: 'project',
  title: 'Ana sayfada haftalık trendi göster',
  difficulty: 'orta',
  concepts: ['fetch.basics', 'fetch.loading-states', 'react.useEffect.deps', 'react.context'],
  project: 'sinema',
  focusFiles: ['src/pages/HomePage.tsx', 'src/components/MovieGrid.tsx'],
  reviewFiles: ['src/pages/HomePage.tsx'],
  rubric: ['Ana sayfa statik örnekleri kullanmıyor', 'Loading, hata ve boş liste ayrılıyor'],
  hints: [
    '`HomePage` içinde `useEffect` veya mevcut `useFetch` ile `/trending/movie/week` isteği yap.',
    'Liste cevabının `results` dizisini `MovieGrid`e ver; `sampleMovies` import’unu kaldır.',
    'İstek sürerken durum metni, hatada alert göster; kart linkleri mevcut `/movie/:id` rotasına gitsin.',
  ],
})
