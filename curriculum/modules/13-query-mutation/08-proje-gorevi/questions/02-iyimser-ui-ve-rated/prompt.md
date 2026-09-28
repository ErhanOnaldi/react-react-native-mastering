Film puanını seçince yeni değer hemen görünmeli; sunucu reddederse eski değer geri gelmeli. Ayrıca kullanıcının puanladığı filmler `/rated` sayfasında yer almalı.

## Gereksinimler

- Puanlama başlar başlamaz aynı session’ın rated cache’inde film eklenmeli veya puanı güncellenmeli.
- POST başarısız olursa eski cache değeri geri yüklenmeli; hata kullanıcıya erişilebilir biçimde gösterilmeli.
- İşlem tamamlanınca rated liste son sunucu durumuyla uzlaşmalı.
- Yarım puan adımları 0,5–10 arasında seçilebilmeli; seçilen değer `onRate` callback’ine iletilmeli.
- `RatingStars` mevcut puanı, bekleme ve hata durumlarını erişilebilir metinle göstermeli.
- `/rated` route’u bulunmalı; sayfa film başlığını ve puanını göstermeli, boş ve hata durumları için anlaşılır UI sunmalı.
- Router’da film detayındaki puanlama kontrolü bu akışa bağlı olmalı.

## Örnek

550 numaralı filme 8,5 verildiğinde rated listede “Dövüş Kulübü” ve “8,5 puan” görünür. Aynı POST 500 dönerse önceki puan korunur.

## Sözleşme

- `src/features/rating/hooks/useRateMovie.ts`: `useRateMovie(sessionId)`; mutation variables `{ movieId: number; value: number }`.
- `src/features/rating/components/RatingStars.tsx`: `RatingStars({ movieId, value, onRate })`; `movieId: number`, `value: number | null`, `onRate(value: number): void`.
- `src/pages/RatedPage.tsx`: default export `RatedPage`.
- `src/router.tsx`: export edilen `routes` içinde `/rated` route’u.
