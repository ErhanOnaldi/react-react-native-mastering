Sinema projesinde `src/types/tmdb.ts` dosyasını genişlet. `Movie` tipini ve mevcut import'ları koru; liste öğesinde `genre_ids: number[]` vardır. Detay fixture'ı `movie-550.json` ise `genre_ids` yerine `genres` taşır. Yeni tipleri **export** et:

- `Genre`: `{ id: number; name: string }`.
- `CastMember`: en az `id: number`, `name: string`, `character: string`, `profile_path: string | null`, `order: number`.
- `CrewMember`: en az `id: number`, `name: string`, `job: string`, `department: string`, `profile_path: string | null`.
- `Video`: en az `id: string`, `key: string`, `name: string`, `site: string`, `type: string`, `official: boolean`, `size: number`, `published_at: string`.
- `MovieDetails`: `Omit<Movie, 'genre_ids'>` tabanlı; `runtime: number | null`, `genres: Genre[]`, `tagline: string`, `status: string`, `budget: number`, `revenue: number`. `credits?: { cast: CastMember[]; crew: CrewMember[] }` ve `videos?: { results: Video[] }`; bu iki alan yalnız `append_to_response` ile gelebilir.
- `Paginated<T>`: `{ page: number; results: T[]; total_pages: number; total_results: number }`. Önceki `MovieListResponse` adını `type MovieListResponse = Paginated<Movie>` olarak koru.

`src/lib/tmdb-image.ts` oluştur: `export type ImageSize = 'w185' | 'w342' | 'w500' | 'original'`; `export function posterUrl(path: string | null, size?: ImageSize): string | undefined`. Varsayılan boyut `w342`; örnek: `posterUrl('/abc.jpg')` → `https://image.tmdb.org/t/p/w342/abc.jpg`, `posterUrl('/abc.jpg','w185')` → `https://image.tmdb.org/t/p/w185/abc.jpg`. `null` için `undefined` döndür. TMDB yolu baştaki `/` ile gelir; URL'de çift slash üretme. Bu işlev gerçek isteği başlatmaz.
