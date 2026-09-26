## Bağlam

MSW’deki `server.use` alışkanlığını tarayıcı isteğine taşı. Sinema araması gerçek TMDB’ye giderse CI testi rastlantısal olur. Bu görevde bir Playwright `Page` üzerine route kuracaksın.

## Görev

`mockSearch(page: Page): Promise<void>` fonksiyonunu tamamla.

- `https://api.themoviedb.org/3/search/movie` adresine giden GET isteklerini yakala; query string değişebilir.
- `Authorization: Bearer <token>` yoksa **401** ve `{ status_code: 7 }` döndür.
- `query=dövüş` için `[{ id: 550, title: 'Dövüş Kulübü' }]` sonucunu TMDB liste zarfında döndür.
- Başka sorgu için boş `results` döndür. `page` ve `total_pages` 1, `total_results` sonuç sayısı olsun.

## Örnek

`?query=d%C3%B6v%C3%BC%C5%9F` ve Bearer başlığı → bir sonuç; `?query=bilinmeyen` → sıfır sonuç. Böylece URL kodlaması ile uğraşmak yerine `URLSearchParams` kullanırsın.
