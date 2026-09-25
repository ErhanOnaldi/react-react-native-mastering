Puanladıklarım listesi açıkken aynı filme verilen puan 8,5’ten 9’a değişti. Yeni değer zaten elinde; yalnız mevcut listeyi immutably güncelle.

`patchRating(client, sessionId, movieId, value)` fonksiyonu `['ratings', sessionId]` cache’inde `RatedMovie[]` tutar. Film varsa `rating` alanını değiştir; yoksa listeyi olduğu gibi bırak. Cache hiç yoksa yeni kayıt yaratma.

Örnek: `[{id:550,rating:8.5}]` + `550,9` → `[{id:550,rating:9}]`. Eski dizi ve nesne değişmemeli.
