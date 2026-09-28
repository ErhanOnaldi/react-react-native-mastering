Dövüş Kulübü için yerel state’e yazılan 8,5 TMDB’de görünmüyor. Guest session’ı yeniden kullanıp puanı sunucuya kaydet.

## Gereksinimler

- `getGuestSession()` önce `localStorage` içindeki `guest_session_id` değerini kullansın.
- Değer yoksa `GET /authentication/guest_session/new` çağrılsın; dönen session id saklansın ve sonraki çağrılarda tekrar kullanılsın.
- `rateMovie({ movieId, value })` yalnızca 0,5–10 arasındaki 0,5 katlarını kabul etsin.
- Puan `POST /movie/:id/rating?guest_session_id=...` isteğinde JSON `{ value }` olarak gönderilsin.
- Her istekte `Authorization: Bearer ${import.meta.env.VITE_TMDB_TOKEN}` başlığı bulunsun.
- HTTP hata cevabında Promise `Error` ile reject olsun; geçersiz puanda POST atılmasın.

## Örnek

`await rateMovie({ movieId: 550, value: 8.5 })` sonrasında aynı session’ın puanlanan listesinde Dövüş Kulübü 8,5 puanla bulunur.

## Sözleşme

- `ratingApi.ts` dosyasından `getGuestSession(): Promise<string>` ve `rateMovie(input: { movieId: number; value: number }): Promise<void>` export et.
- TMDB yolları `/3` taban yoluna göre belirtilmiştir.

## Kısıtlar

- Guest session id `guest_session_id` localStorage anahtarı altında saklanır.
- İsteklerde mevcut `VITE_TMDB_TOKEN` kullanılır.
