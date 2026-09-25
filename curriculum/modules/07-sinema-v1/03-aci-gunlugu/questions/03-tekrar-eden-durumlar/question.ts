import { defineQuestion } from '@rm/content/define'

export default defineQuestion({
  type: 'quiz',
  title: 'Dört sayfada aynı dallar',
  difficulty: 'zor',
  concepts: ['fetch.loading-states', 'react.custom-hooks', 'react.useEffect.deps'],
  question:
    'HomePage, SearchPage, MovieDetailsPage ve FavoritesPage içinde ayrı `loading`, `error`, `data` state’i ve benzer koşullu render var. Ayrıca `/movie/550` → `/movie/27205` uygulama içi geçişinde eski başlık kalıyor. En doğru iki gözlem hangileri?',
  mode: 'multiple',
  options: [
    {
      text: 'Loading/error akışı tekrar ediyor; ortak veri aracı için somut ihtiyaç oluştu.',
      correct: true,
      explanation:
        'Dört sayfadaki benzer durum geçişleri tekrarı görünür kılıyor. Sonraki modüllerde merkezi veri yönetimi için bu kanıtı kullanacaksın.',
    },
    {
      text: 'Detay effect’inde kullanılan movieId dependency array’de yoksa yeni URL eski filmi bırakabilir.',
      correct: true,
      explanation:
        'Effect eski id ile çalışmış; aynı bileşen yeni parametreyle render edilse de boş dependency array yeni isteği tetiklemez.',
    },
    {
      text: 'URL değişince React her zaman tüm sayfaları ve state’i sıfırlar.',
      explanation:
        'Aynı route bileşeni farklı `:id` ile korunabilir; render olur ama effect bağımlılıkları doğru değilse veri yenilenmez.',
    },
    {
      text: 'Dört sayfaya aynı loading metnini kopyalamak ağ isteği sayısını azaltır.',
      explanation:
        'Görünüm metni ağ cache’i değildir. Tekrar kod ve tekrar istek ayrı gözlemlerdir.',
    },
  ],
})
