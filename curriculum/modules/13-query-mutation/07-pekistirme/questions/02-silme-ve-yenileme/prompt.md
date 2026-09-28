DELETE başarılı ama Puanladıklarım listesi eski kalıyor. Başarılı silmede yalnız doğru oturumun listesini yenile.

## Gereksinimler

- `remove(movieId)` mutation fonksiyonudur.
- Başarıdan sonra yalnız `['ratings', sessionId]` key’iyle başlayan liste stale olsun.
- Başarısız DELETE mevcut cache verisini korusun ve invalidation yapmasın.
- Callback Promise’i döndürsün.

## Örnek

`guest-1` oturumunda 550 filmi silinince `guest-1` listesi geçersiz olur; `guest-2` listesi olmaz.

## Sözleşme

- `useDeleteRating.ts` dosyasından `useDeleteRating(sessionId, remove)` named export et.
- `remove(movieId: number): Promise<void>`; hook sonucu mutation sonucu olmalı.
