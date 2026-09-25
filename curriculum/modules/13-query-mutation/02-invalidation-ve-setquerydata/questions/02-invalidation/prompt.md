Puanlama POST’u 201 döndü fakat önceden açılmış Puanladıklarım listesi boş. `useRate(rate, sessionId)` hook’unu yaz.

- `rate` async mutation fonksiyonudur; `{ movieId, value }` alır.
- Başarılı yazmadan sonra yalnızca `['ratings', sessionId]` query ailesini invalidate et.
- `onSuccess` Promise döndürsün: aktif liste GET’i tamamlanana dek mutation pending kalsın.

`useRate` dönüşü `useMutation` sonucudur; test bileşeni `mutate` kullanacak.
