Bir filmin puanı 8,5’ten 9’a değişti. Elde bulunan kesin değerle listedeki kaydı güncelle; diğer verileri ve önceki nesneleri koru.

## Gereksinimler

- `['ratings', sessionId]` cache’inde `{ id, title, rating }[]` bulunabilir.
- Film listede varsa yalnız eşleşen kaydın `rating` alanı değişsin.
- Film yoksa liste içeriği değişmesin.
- Cache yoksa yeni liste veya kayıt yaratılmasın.
- Eski array ve nesneler mutate edilmesin.

## Örnek

`[{ id: 550, title: 'Dövüş Kulübü', rating: 8.5 }]` ve `movieId: 550, value: 9` girdisi aynı başlıkla `rating: 9` döndürür.

## Sözleşme

- `patchRating.ts` dosyasından `patchRating(client, sessionId, movieId, value): void` named export et.
- `client` bir TanStack Query `QueryClient`; puan listesi key’i `['ratings', sessionId]`.
