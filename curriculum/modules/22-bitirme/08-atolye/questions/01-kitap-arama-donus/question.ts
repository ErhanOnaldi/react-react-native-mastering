import { defineQuestion } from '@rm/content/define'

export default defineQuestion({
  type: 'code',
  title: 'Kitap arama ve geri dönüş',
  difficulty: 'zor',
  concepts: ['query.keys', 'query.pagination', 'router.search-params'],
  files: ['BookSearch.tsx'],
  preview: { entry: 'Preview.tsx' },
  hints: [
    'Arama parametrelerini (`q` ve `page`) URL üzerinden yönet; bileşen render olduğunda URL’den gelen parametrelere göre veriyi yükle.',
    "Veri çekme işleminde `useQuery` kullan; sorgu anahtarını `['search', q, page]` olarak kurarak her arama ve sayfa sonucunun önbellekte tutulmasını sağla.",
    "Sayfa değiştiğinde `setSearchParams` ile URL’deki `page` değerini artır; form gönderildiğinde `setSearchParams({ q: searchInput, page: '1' })` çalıştır.",
    'Sorgu anahtarında `page` değerini unutursan sayfa değiştiğinde yeni veri çekilmez; `q` parametresini dahil etmezsen farklı aramalar birbirine karışır.',
  ],
})
