import { defineQuestion } from '@rm/content/define'

export default defineQuestion({
  type: 'quiz',
  title: 'CSP kaynak yönergeleri',
  difficulty: 'kolay',
  concepts: ['security.csp'],
  question:
    'Bir React uygulamasında TMDB poster görsellerini (`https://image.tmdb.org`) göstermek ve TMDB API’sine (`https://api.themoviedb.org`) `fetch` isteği atmak istiyorsun. Content-Security-Policy (CSP) başlığında hangi yönerge eşleşmesi doğrudur?',
  options: [
    {
      text: 'Görseller için `img-src https://image.tmdb.org`, API istekleri için `connect-src https://api.themoviedb.org`.',
      correct: true,
      explanation:
        '`img-src` görsel kaynaklarını (`<img>`, posterler) denetler; `connect-src` ise `fetch`, `XMLHttpRequest` ve WebSocket gibi ağ isteklerinin gidebileceği hedefleri sınırlar.',
    },
    {
      text: 'Hem görseller hem API istekleri yalnızca `script-src` yönergesiyle tanımlanır.',
      correct: false,
      explanation:
        '`script-src` yalnızca çalıştırılabilir JavaScript dosyalarının kaynaklarını sınırlar; görsel veya fetch isteklerini kapsamaz.',
    },
    {
      text: "`default-src 'none'` tanımlandığında diğer tüm yönergeler otomatik olarak devre dışı kalır.",
      correct: false,
      explanation:
        '`default-src`, açıkça belirtilmeyen yönergeler için varsayılan kuralı belirler; özel bir yönerge (ör. `img-src`) tanımlandığında o yönerge `default-src` değerini ezer.',
    },
  ],
})
