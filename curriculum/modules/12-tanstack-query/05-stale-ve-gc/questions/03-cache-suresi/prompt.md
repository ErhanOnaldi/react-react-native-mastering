Cache’e rağmen geri dönüşte GET gördün. Detay verisi için tazelik ve saklama süresini ayrı seç.

## İstenen

`detailOptions(id)` `queryOptions` döndürsün: key `['movies','detail',id]`, `staleTime: 60_000`, `gcTime: 300_000`. TMDB `/movie/:id` çağrısına Bearer ve `language=tr-TR` ekle; HTTP hatasını fırlat. Aynı id için art arda iki `fetchQuery` bir GET olmalı.
