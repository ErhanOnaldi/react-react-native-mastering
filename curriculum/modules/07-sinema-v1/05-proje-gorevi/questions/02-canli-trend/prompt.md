Ana sayfada yerel test verileri yerine harici film veritabanından çekilen güncel trend filmleri listelenmelidir. Ana sayfa rotasını canlı API verisine bağla.

## Gereksinimler

- Bileşen ilk açıldığında harici API'den haftalık trend filmleri (`/trending/movie/week`) çekilmelidir.
- İstek devam ederken kullanıcıya "Filmler yükleniyor..." durum metni gösterilmelidir.
- Ağ veya HTTP hatası oluştuğunda erişilebilir bir hata bildirimi (`role="alert"`) gösterilmelidir.
- Dönen sonuç listesi (`results`) film kartları ızgarası (`MovieGrid`) aracılığıyla listelenmeli; statik örnek film dizisi kullanılmamalıdır.
- Her film kartı kendi detay sayfasına giden `/movie/:id` bağlantısını ve favori etkileşimini korumalıdır.

## Örnek

Kullanıcı ana sayfayı (`/`) açtığında:
1. Ekranda önce "Filmler yükleniyor..." metni görünür.
2. API yanıtı geldiğinde liste güncellenir ve haftanın trend filmi (ör. "Unabomber") `/movie/1492640` bağlantısıyla ekranda listelenir.

## Sözleşme

- Dosya ve export: `src/pages/HomePage.tsx` → `HomePage` (named export)
- Rota: `src/router.tsx` dosyasında `/` index rotasında `HomePage` bileşeni yer almalıdır.
- İstek: `GET /trending/movie/week` (Türkçe dil tercihi ve yetkilendirme başlığıyla)
- Yükleme metni: `/filmler yükleniyor/i` kalıbına uyan durum metni

## Kısıtlar

- Bu aşamada önbellek kütüphaneleri eklenmez; doğrudan bileşen yaşam döngüsüyle veri çekilir.
