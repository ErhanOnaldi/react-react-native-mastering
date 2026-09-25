Arama sayfasında sayfa 1 ve sonraki sayfalar ayrı `fetch` bloklarında. İkisi de çalışıyor; ancak token veya dil değişince iki yer düzeltilecek.

## Önce gözlemle

Starter davranış testlerini geçer. Ayrı URL kurucusunun testi başlangıçta kalır; rubric yeni sınırın kullanımını inceler.

## İstenen

`searchMovies(query, page, token)` aynı TMDB cevabını döndürmeye devam etsin.

- Yol: `/search/movie`, `language=tr-TR`, `query`, `page`.
- `Authorization: Bearer <token>` korunmalı.
- Tek `fetch` çağrı yeri olsun.
- `query` değerini `URL.searchParams` kodlasın.
- `buildSearchUrl.ts` içinde `buildSearchUrl(query, page): string` export et; `searchMovies` bu URL'yi kullansın.
- Dönen tipte `page` ve `results` içindeki `id/title` bulunsun.

Boş arama kuralı ekleme; burada mevcut davranışı koruyoruz.
