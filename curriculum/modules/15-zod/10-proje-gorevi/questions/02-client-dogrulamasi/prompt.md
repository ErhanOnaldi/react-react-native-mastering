9. modüldeki generic `tmdbClient.get<T>(path, params?)` gerçek JSON'u denetlemiyordu. API sınırını düzelt.

- `src/shared/api/tmdb-client.ts`: `tmdbClient.get(path, schema, params?)` imzası olsun. `schema` bir Zod şeması; dönüş tipi şemanın `z.output` tipinden çıksın. Var olan `language=tr-TR`, Bearer token ve HTTP `ApiError` davranışını koru.
- HTTP başarılı olsa bile JSON verilen şemaya uymuyorsa anlaşılır bir hata fırlatsın. Hata mümkünse bozuk alanı gösterebilsin.
- `src/features/movies/api/movies-api.ts` çağrılarında trend, keşfet ve arama `movieListSchema`; detay `movieDetailsSchema` ile doğrulansın. Tür listesi de doğrulansın.
- Testte `server.use` 550 için `{ id: 550, title: null }` döndürür: istek 200 olsa da promise reddedilmeli.
