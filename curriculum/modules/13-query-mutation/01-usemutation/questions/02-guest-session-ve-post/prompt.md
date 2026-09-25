Dövüş Kulübü için yerel state’e yazılan 8,5 TMDB’de görünmüyor. İki gerçek isteği kur.

- `getGuestSession()` önce `localStorage` içindeki `guest_session_id` değerini kullanır; yoksa `GET /authentication/guest_session/new` ile alıp saklar.
- `rateMovie({ movieId, value })` 0,5–10 aralığında 0,5 adımlarını kabul eder. `POST /movie/:id/rating?guest_session_id=...` isteğinde JSON `{ value }` gönderir.
- Her isteğe `Authorization: Bearer ${import.meta.env.VITE_TMDB_TOKEN}` ekle. HTTP hata cevaplarında `Error` fırlat.

Örnek: `await rateMovie({ movieId: 550, value: 8.5 })` sonrası sunucudaki puanlananlar listesi Dövüş Kulübü’nü içerir.
