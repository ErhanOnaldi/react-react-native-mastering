Puanlamanın ekranda hemen görünmesini sağla.

## Dosyalar ve export’lar

- `src/features/rating/hooks/useRateMovie.ts`: `useRateMovie(sessionId)` export et. `rateMovie` yazma işlemi başlar başlamaz aynı oturumun `ratedMoviesQuery(sessionId).queryKey` listesindeki puan geçici olarak değişsin. Sunucu hata verirse eski değer geri gelsin; işlem bitince liste tazelensin.
- `src/features/rating/components/RatingStars.tsx`: `RatingStars({ movieId, value, onRate })` export et. 0,5–10 puan seçilebilir ve `onRate(value)` çağrılır. Seçilen değeri erişilebilir metinle göster; bekleyen ve hata durumlarını belirt.
- `src/pages/RatedPage.tsx`: default export `RatedPage`. Geçerli oturumun Puanladıklarım listesini başlık ve puanla göster; boş ve hata durumlarını göster.
- `src/router.tsx`: `/rated` route’u ve nav link’i ekle. Detay sayfasında `RatingStars` kullan; verilen puan rated sayfasında hemen görünsün.

MSW ile 500 POST dene: geçici 8,5 önce görünmeli, sonra eski puan geri gelmeli. Paralel mutation çakışmalarını ayrıca değerlendir.
