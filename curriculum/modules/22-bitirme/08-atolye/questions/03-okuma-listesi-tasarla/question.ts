import { defineQuestion } from '@rm/content/define'

export default defineQuestion({
  type: 'project',
  project: 'atolye',
  title: 'Okuma listesi tasarla',
  difficulty: 'zor',
  concepts: ['arch.state-categories', 'arch.feature-folders', 'capstone.state-map'],
  reviewFiles: ['src/okuma-listesi-tasarla/**'],
  hints: [
    'Veri kategorilerini ayır: arama ve açık eser bilgisi URL’de; arama sonuçları ve detaylar sunucu önbelleğinde; okuma listesi ise istemci tarafında kalıcı saklanmalıdır.',
    'URL state için arama parametreleri (`searchParams`) veya rota parametreleri (`params`) kullan; sunucu verisini `useQuery` ile çek; okuma listesini `localStorage` ile senkronize bir React state’inde (veya Context) yönet.',
    'Ekranı üç parçaya böl: arama formu ve sonuç listesi, seçili eserin detay paneli, kullanıcının yerel okuma listesi paneli.',
    'Okuma listesini yalnızca geçici bir `useState` içinde tutarsan sayfa yenilendiğinde kullanıcı verisi kaybolur; depodan okurken boş veya bozuk değer durumunu mutlaka ele al.',
  ],
  rubric: [
    'Gerçek Open Library araması çalışır ve sonuçlar eser başlıklarını gösterir.',
    'Bir eserin detayına gidilebilir ve gerçek eser verisi görünür.',
    'Kitap okuma listesine eklenip çıkarılabilir; sayfa yenilense de liste kalıcıdır.',
    'Arama ve açık eser adres çubuğunda paylaşılabilir bağlantı olarak tutulur.',
    'Sonuç yokken ve istek hata verince ekran anlaşılır bir durum gösterir.',
    'Arama/eser sunucu verisi, kalıcı okuma listesi ve geçici ekran durumu ayrı sorumluluklarla yönetilir.',
  ],
})
