Detay isteğini yalnız geçerli film id’si geldiğinde başlat; eksik id için istek gönderme.

## Gereksinimler

- Hook hem `undefined` id hem sayısal id kabul etsin.
- Id yokken fetch durumu idle olsun ve ağ isteği çıkmasın.
- Id 550 geldiğinde film detayını alıp `Dövüş Kulübü` başlığını döndür.

## Örnek

`useOptionalMovie(undefined)` → bekleyen ama fetch etmeyen sonuç; id 550’ye güncelle → bir detay isteği ve film cevabı.

## Sözleşme

- `useOptionalMovie.ts` dosyasından `useOptionalMovie(id: number | undefined)` named export edilir.
- Dönen query sonucu `data?.title` alanını sunar.

## Kısıtlar

- İstek `Authorization: Bearer test-token` başlığını taşır; eksik id için URL oluşturulmaz.
