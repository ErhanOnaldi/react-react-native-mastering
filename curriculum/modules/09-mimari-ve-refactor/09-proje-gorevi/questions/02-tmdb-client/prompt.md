Sinema isteklerinde ortak yetkilendirme, dil ve hata bilgisi kullan; mevcut ekranları yeni HTTP sınırına bağla.

## Gereksinimler

- GET istekleri TMDB `/3` köküne gitsin.
- Her istekte `language=tr-TR` ve `Authorization: Bearer <token>` gönderilsin; token URL'de bulunmasın.
- Token değeri `import.meta.env.VITE_TMDB_TOKEN` kaynağından gelsin.
- String/number parametreler query'ye eklensin, `undefined` değerler atlanmalı.
- Başarıda JSON `Promise<T>` olarak dönsün. Bu tip dış JSON'u çalışma anında doğruladığı anlamına gelmez.
- HTTP hatasında HTTP status, TMDB kodu veya `null`, açıklayıcı TMDB mesajı veya varsayılanı taşınsın.
- Mevcut ekranlar ortak client üzerinden çalışsın; arama, detay, sayfalama ve favoriler korunmalı.

## Örnek

Film 550 yanıtında `Dövüş Kulübü` döner. Olmayan film için 404 ve TMDB kodu 34 ile hata alınır.

## Sözleşme

- `src/shared/api/tmdb-client.ts` → named export `tmdbClient` ve `ApiError`.
- `tmdbClient.get<T>(path: string, params?: Record<string, string | number | undefined>): Promise<T>`.
- `ApiError` alanları: `status`, `statusCode`, `message`.

## Kısıtlar

- Token yalnız Authorization başlığında gönderilir.
