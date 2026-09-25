Sinema’da aynı Bearer başlığı, dil ve hata denetimi farklı sayfalara kopyalanmış. Bir sayfa başlığı unutunca TMDB 401 dönüyor.

## İstenen

`src/shared/api/tmdb-client.ts` dosyasından **`tmdbClient`** ve **`ApiError`** export et.

- `tmdbClient.get<T>(path, params?)` TMDB `/3` köküne GET atsın; `params` string, number veya undefined değerleri kabul etsin. `undefined` alanları atla.
- Her isteğe `language=tr-TR` ve `Authorization: Bearer ${import.meta.env.VITE_TMDB_TOKEN}` ekle. Token’ı URL’ye koyma.
- Başarıda JSON’u `Promise<T>` olarak döndür. Bu TypeScript tipidir; JSON’un runtime doğrulaması modül 15’in konusu.
- HTTP hata cevabında `ApiError` fırlat. `status` HTTP kodu, `statusCode` TMDB `status_code` değeri (yoksa `null`), `message` TMDB `status_message` değeri (yoksa anlaşılır bir varsayılan) olsun.
- Önceki `tmdbFetch` çağrılarını bu ortak kapıya taşı; çalışan ekranları koru.

Örnek: `tmdbClient.get<{ title: string }>('/movie/550')` sahte TMDB’de `Dövüş Kulübü` başlığını verir. `'/movie/999999'` 404 ve `statusCode: 34` ile `ApiError` fırlatır.
