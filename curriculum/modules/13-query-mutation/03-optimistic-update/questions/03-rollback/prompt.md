Puanladıklarım başka route’ta da görünüyor; yalnız butondaki pending metni yetmiyor. `useOptimisticRating(sessionId)` yaz.

- `['ratings', sessionId]` cache’i `{ id, title, rating }[]` tutar. `rate` fonksiyonu `{ movieId, value, title }` alır ve TMDB’ye POST atar.
- `onMutate`: eski GET’i iptal et, snapshot al, filmi ekle/güncelle.
- `onError`: snapshot’ı geri yükle. `onSettled`: listeyi invalidate et.
- Test `server.use` ile POST’u 500 yapar; geçici puan önce görünmeli, sonra eski puan geri gelmeli.

Aynı anda birden fazla değişiklikte snapshot çakışabilir; bu görevde tek mutation var.
