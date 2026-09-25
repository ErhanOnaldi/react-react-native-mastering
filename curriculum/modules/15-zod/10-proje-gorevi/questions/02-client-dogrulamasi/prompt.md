9. modüldeki generic `tmdbClient.get<T>(path, params?)` gerçek JSON'u denetlemiyordu. API sınırını düzelt.

- `src/shared/api/tmdb-client.ts`: `tmdbClient.get(path, schema, params?)` imzası olsun. `schema` bir Zod şeması; dönüş tipi şemanın `z.output` tipinden çıksın. Var olan `language=tr-TR`, Bearer token ve HTTP `ApiError` davranışını koru.
- HTTP başarılı olunca `response.json()` sonucunu `unknown` kabul edip şemayla parse et. Geçersiz veri anlaşılır bir hata fırlatsın; `z.prettifyError` alan yolunu loglamada veya mesajda kullanılabilir.
- `src/features/movies/api/movies-api.ts` çağrılarını yeni imzaya taşı: trend, keşfet ve arama için `movieListSchema`; detay için `movieDetailsSchema`. Tür listesi için ayrıca küçük bir genre response şeması yazabilirsin.
- Testte `server.use` 550 için `{ id: 550, title: null }` döndürür: istek 200 olsa da promise reddedilmeli.
