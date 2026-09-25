Sinema kartı, TMDB'den gelen ham nesneyi kullanmadan önce doğrulasın. `movieSchema` ve `parseMovie(raw: unknown)` export et.

- `id`: pozitif tam sayı, `title`: boş olmayan string.
- `poster_path`: string veya null; eksik alan kabul edilmesin.
- Başarılı parse sonucunu döndür, yanlış veri için Zod hatası fırlat.

Örnek: `{ id: 550, title: "Dövüş Kulübü", poster_path: null }` geçer. `title: null` kalır.
