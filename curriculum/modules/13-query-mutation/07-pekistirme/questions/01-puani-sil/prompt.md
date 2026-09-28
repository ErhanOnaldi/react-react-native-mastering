Dövüş Kulübü puanını kaldırıyorsun; yalnızca arayüzden silmek sunucudaki kaydı kaldırmaz.

## Gereksinimler

- `DELETE /movie/:id/rating?guest_session_id=...` isteği gönderilsin.
- Her istekte Bearer yetkilendirme başlığı bulunsun.
- HTTP hata cevabında Promise `Error` ile reject olsun.
- Fonksiyon `Promise<void>` döndürsün.

## Örnek

`deleteRating(550, 'guest-1')` çağrısı 550 numaralı film için aynı session id ile DELETE isteği yollar.

## Sözleşme

- `deleteRating.ts` dosyasından `deleteRating(movieId: number, sessionId: string): Promise<void>` named export et.
- TMDB API taban yolu `https://api.themoviedb.org/3`.

## Kısıtlar

- Session id URL query parametresinde encode edilmelidir.
