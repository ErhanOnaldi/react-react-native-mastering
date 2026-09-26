Sinema’daki puanlamayı gerçek TMDB yazma akışına bağla.

## Dosyalar ve export’lar

- `src/features/rating/api/rating-api.ts`: `getGuestSession(): Promise<string>`, `rateMovie({ movieId, value }): Promise<void>`, `deleteRating(movieId): Promise<void>` export et. Session id’yi `localStorage` içinde sakla; yoksa `GET /authentication/guest_session/new` ile aç. POST/DELETE için `guest_session_id` query parametresi kullan. Var olan `tmdbClient` ya da eşdeğer Bearer başlıklı fetch ile çağır. 400/401/500’de Error fırlat.
- `src/features/rating/api/rating-queries.ts`: `ratedMoviesQuery(sessionId)` export et. Bu tarif `['ratings', sessionId]` cache key’iyle `GET /guest_session/:id/rated/movies` yanıtını versin. Sonuç `{ page, results, total_pages, total_results }`; her sonuçta `rating` vardır.

Örnek: Dövüş Kulübü’ne 8,5 verince aynı session’ın rated listesinde `{ id: 550, rating: 8.5 }` görünür. Geçersiz puanı kullanıcıya açık hata olarak döndür.
