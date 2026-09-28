Arama kutusundaki ifadeye ait filmleri listele; bekleme, boş sonuç ve sunucu hatası kullanıcıya farklı görünsün.

## Gereksinimler

- Beklerken `Aranıyor` metnini göster.
- Sonuç yoksa `Sonuç yok` göster.
- Başarılı aramada film başlıklarını listele.
- Hata durumunda `role="alert"` olan bir öğede `Hata: Arama yüklenemedi` göster.
- Sunucudan HTTP 500 geldiğinde bunu başarılı boş cevap gibi gösterme.

## Örnek

`query="Dövüş"` → `Dövüş Kulübü`; eşleşme olmayan ifade → `Sonuç yok`; sunucu hatası → alert içinde hata mesajı.

## Sözleşme

- `SearchStatus.tsx` dosyasından `SearchStatus({ query }: { query: string })` named export edilir.
- TMDB arama yanıtındaki `results[].title` metinleri görünür listeyi oluşturur.

## Kısıtlar

- İstek `/3/search/movie` adresine `query` ve `language=tr-TR` parametrelerini gönderir ve `Authorization: Bearer test-token` başlığını taşır.
