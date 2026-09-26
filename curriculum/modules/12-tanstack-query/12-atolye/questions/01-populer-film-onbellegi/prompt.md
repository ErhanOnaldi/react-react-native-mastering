Popüler filmler ekranını aç, başka yere git ve bir dakika dolmadan dön. Aynı listeyi yeniden ağdan beklemek istemiyoruz. İlk açılışta yükleme, başarısız cevapta hata görünmeli.

Testler `PopularMovies.tsx` içindeki `PopularMovies` bileşenini veri sağlayıcısıyla açar. TMDB `/movie/popular` filmlerinin başlıklarını listele; ağ hatasında okunabilir bir uyarı göster.

Örnek: aç → ayrıl → dön → aynı başlıklar, toplam bir popüler film isteği.

## Arayüz sözleşmesi

- Hata mesajı `yüklenemedi` kelimesini içersin.
