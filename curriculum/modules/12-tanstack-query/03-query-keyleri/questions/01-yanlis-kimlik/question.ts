import { defineQuestion } from '@rm/content/define'

export default defineQuestion({
  type: 'quiz',
  title: 'Yanlış cache kimliği',
  difficulty: 'kolay',
  concepts: ['query.keys', 'router.search-params', 'react.useEffect.deps'],
  question: `Şu sorgu önce Matrix'i aradı, sonra URL'de Dövüş seçildi. İkinci ekranda Matrix sonuçları görünüyor. Hangi değişiklik iki cevabı ayrı cache girdilerine ayırır?

\`\`\`ts
useQuery({
  queryKey: ['movies', 'search'],
  queryFn: () => searchMovies(q),
})
\`\`\``,
  options: [
    {
      text: '`q` değerini `queryKey` dizisine ekle',
      correct: true,
      explanation: 'Farklı arama sonucu farklı cache girdisidir.',
    },
    {
      text: 'Key aynı kalsın, yalnız `queryFn` içinde yeni `q` kullanılsın',
      explanation:
        'Fonksiyon yeni metni kullanır ama aynı key eski cache girdisini seçer; kimlik de değişmelidir.',
    },
    {
      text: 'Arama sonucunu component state’ine kopyala ve key’i sabit tut',
      explanation:
        'Kopya state cache kimliğini düzeltmez; arama parametresi değişince sorgu da ayırt edilmelidir.',
    },
  ],
})
