Sinema’da verilen puan sunucuya yazılmıyor ve Puanladıklarım verisinin ortak bir okuma tanımı yok. Guest session, puanlama/silme istekleri ve rated liste bağlantısını kur.

## Gereksinimler

- Guest session varsa tekrar kullan; yoksa yeni session isteği yapıp kimliği sakla.
- Puan yazma ve silme işlemleri session ve yetkilendirme bilgisini kullansın.
- Puan yalnız 0,5–10 aralığındaki 0,5 adımları kabul etsin.
- HTTP hata cevapları Promise’i reject etsin.
- Rated liste cevabı `{ page, results, total_pages, total_results }` biçiminde olsun; sonuç nesnelerinde `rating` bulunsun.
- Puanlama sonrası aynı session’ın rated listesinde film ve puanı görünsün; silme sonrası film listeden çıksın.

## Örnek

Dövüş Kulübü’ne 8,5 verince `ratedMoviesQuery(sessionId)` sonucunda `{ id: 550, rating: 8.5 }` bulunur. Silme sonrası aynı film sonuçlarda bulunmaz.

## Sözleşme

- `src/features/rating/api/rating-api.ts`: `getGuestSession`, `rateMovie`, `deleteRating` export’ları.
- `src/features/rating/api/rating-queries.ts`: `ratedMoviesQuery(sessionId)` export’u.
- İmzalar: `getGuestSession(): Promise<string>`, `rateMovie(input: { movieId: number; value: number }): Promise<void>`, `deleteRating(movieId: number): Promise<void>`.
- `ratedMoviesQuery(sessionId)` `{ page, results, total_pages, total_results }` biçiminde veri döndürür; her sonuçta `id`, `title` ve `rating` bulunur.
- Query key `['ratings', sessionId]` biçimindedir.
