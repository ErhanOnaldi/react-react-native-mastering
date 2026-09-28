`/search?q=matrix` adresini aç. Arama bağlantısıyla `q=dovus` adresine geç ve hemen geri dön. Adres yeniden `q=matrix` olsa da bir süre sonra listede “Dövüş Kulübü” görünüyor. Önizlemedeki bağlantı ve geri düğmesiyle bu belirtiyi yeniden üret ve güncel adresle sonucu eşle.

## Gereksinimler

- Başlangıçta `/search?q=matrix` adresinde Matrix sonucu görünmeli.
- `Dövüş ara` bağlantısını seçip hemen geri dönünce adres `?q=matrix` olmalı.
- Geri dönüş tamamlandıktan sonra Matrix görünmeli; Dövüş Kulübü görünmemeli.

## Örnek

`matrix` ara → `Dövüş ara` seç → geri dön → adres `q=matrix`, ekranda Matrix.

## Sözleşme

- `SearchPage.tsx` içindeki named export `SearchPage` üzerinde çalış.
- Önizlemede `Dövüş ara` bağlantısı ve geri navigasyon kontrolü bulunur.
