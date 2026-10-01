Silme isteği sürerken Dövüş Kulübü satırını Puanladıklarım listesinden hemen kaldır. Sunucu reddederse satır eski puanıyla geri gelsin; başarı olursa yalnız aynı oturumun listesi sunucudan yenilensin.

## Gereksinimler

- Cache key’i `['ratings', sessionId]`; değeri `{ id, title, rating }[]` olabilir.
- `remove(movieId)` silme isteğini yapar ve hata halinde reddedilir.
- İşlem başlamadan önce listenin kopyasını sakla; film kaydını geçici olarak listeden çıkar.
- Hata halinde önceki listeyi geri yükle ve başka session’a dokunma.
- Başarı halinde yalnız `['ratings', sessionId]` key’iyle başlayan sorguları geçersiz kıl.

## Örnek

`guest-1` listesindeki 550 numaralı Dövüş Kulübü silinirken satır hemen kaybolur. İstek hata verirse aynı satır ve puanı geri gelir. `guest-2` listesi değişmez.

## Sözleşme

- `useDeleteRating.ts` dosyasından `useDeleteRating(sessionId, remove)` named export et.
- `remove(movieId: number): Promise<void>`; dönen mutation değişkeni film kimliğidir.
