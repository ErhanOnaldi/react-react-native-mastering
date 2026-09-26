import { defineQuestion } from '@rm/content/define'

export default defineQuestion({
  type: 'code',
  title: 'Kitap arama ve geri dönüş',
  difficulty: 'zor',
  concepts: ['query.keys', 'query.pagination', 'router.search-params'],
  files: ['BookSearch.tsx'],
  preview: { entry: 'Preview.tsx' },
  hints: [
    'Hangi bilgi paylaşılabilir olmalı: arama metni mi, sayfa mı? İkisi de kullanıcının adres çubuğunda görünmeli.',
    'Aynı arama + sayfa kombinasyonu için sonucu bir kere alıp bir süre elde tutabileceğin bir veri katmanı kullan.',
    'URL’deki arama metni ve sayfa değerini query key’e koy; aynı anahtarla gelen isteği önbellek karşılar, ayrı bir ağ isteği atmaz.',
  ],
})
