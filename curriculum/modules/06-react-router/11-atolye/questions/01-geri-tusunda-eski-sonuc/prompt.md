`/search?q=matrix` adresini aç. Arama bağlantısıyla `q=dovus` adresine geç ve hemen geri dön. Adres yeniden `q=matrix` olsa da bir süre sonra listede “Dövüş Kulübü” görünüyor. URL'deki her sorgu için TMDB aramasını başlat ve yalnızca güncel sorgunun sonucunu ekranda tut.

## Gereksinimler

- Başlangıçta `/search?q=matrix` adresinde Matrix sonucu görünmeli.
- `Dövüş ara` bağlantısını seçip hemen geri dönünce adres `?q=matrix` olmalı.
- Geri dönüş tamamlandıktan sonra Matrix görünmeli; Dövüş Kulübü görünmemeli.
- Dolu sorgu için `GET https://api.themoviedb.org/3/search/movie?query=<q>` isteği gönderilmeli; `Authorization` başlığı `Bearer <VITE_TMDB_TOKEN>` olmalı.
- Sorgu boşsa film listesi temizlenmeli ve istek gönderilmemeli.

## Örnek

`matrix` ara → `Dövüş ara` seç → geri dön → adres `q=matrix`, ekranda Matrix.

## Sözleşme

- `SearchPage.tsx` içindeki named export `SearchPage` üzerinde çalış.
- Önizlemede `Dövüş ara` bağlantısı ve geri navigasyon kontrolü bulunur. TMDB token'ı `VITE_TMDB_TOKEN` ortam değişkeninden gelir.
