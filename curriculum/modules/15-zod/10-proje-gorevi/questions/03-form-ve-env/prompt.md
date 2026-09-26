Form kurallarını ve uygulama env değerlerini Zod'a taşı.

1. `src/features/watchlists/schemas.ts` oluştur; named export `watchlistSchema`, `reviewSchema`. `watchlistSchema`: `name` trim sonrası boş değil (`Ad gerekli`), `description` string, `isPublic` boolean, `tags` öğeleri `{ value: string }`. `reviewSchema`: `body` trim sonrası boş değil (`Yorum gerekli`), `rating` 1–5. Form değer tipleri şemayla uyumlu olsun; `Watchlist` kayıt tipindeki `id` ve `createdAt` alanları sadece kayıt sonrası eklensin.
2. `WatchlistForm` ve `ReviewForm` bu şemalarla aynı kuralları uygulasın. Mevcut etiket ekleme/silme, yıldız seçimi, yorum gönderme, label ve hata akışını koru; aynı kuralları iki yerde tekrar etme.
3. `src/shared/config/env.ts` oluştur; named export `env`. `import.meta.env.VITE_TMDB_TOKEN` değeri trimlensin ve boşsa `VITE_TMDB_TOKEN` içeren açık hata versin. Opsiyonel `VITE_APP_TITLE` boşsa `Sinema` olsun. Client Bearer başlığı tokenı buradan okusun.
4. Dönüşen alanların giriş ve çıkış tipleri doğru kalsın.

Mevcut 14. modül form davranışları bozulmamalı.
