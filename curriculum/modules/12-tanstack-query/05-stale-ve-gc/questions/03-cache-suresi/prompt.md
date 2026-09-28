Film detay sorgusunu taze veri ve kullanılmayan cache için ayrı sürelerle ayarla.

## Gereksinimler

- Detay id’sini cache kimliğine ekle ve TMDB detay cevabını döndür.
- Aynı taze id iki kez okunduğunda yalnız bir GET gönder.
- Farklı id’ler ayrı istek ve cache girdisi kullansın.
- Tazelik süresini 60 saniye, kullanılmayan cache süresini 300 saniye yap.

## Örnek

`detailOptions(550)` ve `detailOptions(27205)` ayrı kimlik üretir. Aynı id iki kez okunduğunda `/3/movie/550` için bir istek görülür.

## Sözleşme

- `cachePolicy.ts` dosyasından `detailOptions(id: number)` named export edilir.
- Seçenekler QueryClient’in `fetchQuery` metoduna verilebilir ve data başlığı içerir.

## Kısıtlar

- İstek `Authorization: Bearer test-token` başlığını taşır; HTTP hata yanıtı reject olur.
