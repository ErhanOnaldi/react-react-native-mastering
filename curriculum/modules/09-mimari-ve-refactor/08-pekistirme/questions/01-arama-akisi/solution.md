## Neden böyle?

İki dalın tek farkı `page` değeriydi; farklı fetch akışları için sebep yok. `buildSearchUrl` URL nesnesiyle Türkçe karakterleri doğru kodlar; `searchMovies` isteği tek yerde atar. Davranış testleri başlangıçta yeşildir, yeni birim testi refactor hedefini görünür yapar. Rubric bu birimin gerçekten kullanılmasını inceler. Gerçek Sinema’da ortak HTTP kısmı `shared/api/tmdb-client.ts`, arama anlamı `features/movies/api/movies-api.ts` içine taşınır.
