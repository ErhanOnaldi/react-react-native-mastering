import { defineQuestion } from '@rm/content/define'

export default defineQuestion({
  type: 'code',
  title: 'Önce filtrele, sonra sayfala',
  difficulty: 'orta',
  concepts: ['router.search-params', 'js.array-methods', 'react.derived-state'],
  files: ['selectMovies.ts'],
  hints: [
    'Arama ve tür koşullarından sonra sayfanın başlangıç ve bitiş indekslerini hesapla.',
    'Önce `filter`, ardından `slice`; query string değerlerini `URLSearchParams` ile oku.',
    '`slice((page - 1) * pageSize, page * pageSize)` kullan; bozuk türü filtre gibi uygulama ve Türkçe başlığı locale duyarlı karşılaştır.',
  ],
})
