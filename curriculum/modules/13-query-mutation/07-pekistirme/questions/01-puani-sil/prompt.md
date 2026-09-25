Dövüş Kulübü puanını kaldırıyorsun; sadece listeden silmek TMDB’deki puanı bırakır. `deleteRating(movieId, sessionId)` yaz.

- `DELETE /movie/:id/rating?guest_session_id=...` isteği gönder.
- Bearer başlığı ekle; HTTP hata cevabında Error fırlat.
- Dönüş `Promise<void>` olsun. Listeyi sonrasında mutation invalidation ile yenileyeceksin.
