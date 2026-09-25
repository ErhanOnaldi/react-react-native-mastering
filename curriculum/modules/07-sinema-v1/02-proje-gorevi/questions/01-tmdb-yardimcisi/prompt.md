Sinema'nın her sayfası TMDB'ye bağlanacak. URL, token ve hata işlemini ilk adımda ortak bir dosyaya koy.

## Dosya ve export sözleşmesi

`src/lib/tmdb.ts` oluştur ve **named export** olarak `TMDB_BASE_URL = 'https://api.themoviedb.org/3'` ile `async tmdbFetch<T>(path, params?, init?): Promise<T>` sun.

- `path` `/movie/550` gibi bir TMDB yolu. `params` query değerleri (`string | number | undefined`) içerir. URL'de `language=tr-TR` varsayılan olsun; `URLSearchParams` kullan.
- `fetch` isteğinde `Authorization: Bearer ${import.meta.env.VITE_TMDB_TOKEN}` başlığı olsun. `init` içindeki `signal` gibi seçenekleri koru.
- 2xx cevap gövdesini JSON olarak döndür. `!response.ok` için `Error` fırlat; TMDB'nin `{ status_code, status_message }` gövdesindeki mesajı kullanabilir, gövde bozuksa HTTP durumuna dönebilirsin.
- `.env` dosyasını veya gerçek token'ı Git'e ekleme. Kökteki `.env` içine kendi `VITE_TMDB_TOKEN` değerini yaz; testlerde sahte token hazır.

Örnek: `tmdbFetch<MovieDetails>('/movie/550', { append_to_response: 'credits,videos' })` Türkçe film ve oyuncu bilgisi döndürür. Token yoksa 401, bilinmeyen filmde 404 hata olur.
