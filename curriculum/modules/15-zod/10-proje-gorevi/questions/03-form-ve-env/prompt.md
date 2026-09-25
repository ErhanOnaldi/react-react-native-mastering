Form kurallarını ve uygulama env değerlerini Zod'a taşı.

1. `src/features/watchlists/schemas.ts` oluştur; named export `watchlistSchema`, `reviewSchema`. `watchlistSchema`: `name` trim sonrası boş değil (`Ad gerekli`), `description` string, `isPublic` boolean, `tags` öğeleri `{ value: string }`. `reviewSchema`: `body` trim sonrası boş değil (`Yorum gerekli`), `rating` 1–5. Form değer tiplerini şemadan çıkar; `Watchlist` kayıt tipindeki `id` ve `createdAt` alanları sadece kayıt sonrası eklensin (`.omit()` merdivenini kullanabilirsin).
2. `WatchlistForm` ve `ReviewForm` içinde `zodResolver` kullan. Mevcut etiket ekleme/silme, Controller yıldız, mutation, label ve hata akışını koru; `register` içinde aynı kuralları tekrar etme.
3. `src/shared/config/env.ts` oluştur; named export `env`. Zod ile `import.meta.env.VITE_TMDB_TOKEN` değerini trimle ve boşsa `VITE_TMDB_TOKEN` içeren açık hata üret. Opsiyonel `VITE_APP_TITLE` boşsa `Sinema` olsun. Client Bearer başlığı tokenı buradan okusun.
4. `z.input`/`z.output` farkını dönüşen alanlarda doğru tiple.

Mevcut 14. modül form davranışları bozulmamalı.
