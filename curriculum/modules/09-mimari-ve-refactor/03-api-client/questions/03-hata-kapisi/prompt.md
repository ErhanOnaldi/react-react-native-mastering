Tüm TMDB isteklerinde ortak yetkilendirme ve hata bilgisi kullan; böylece her feature aynı HTTP cevabını tutarlı işler.

## Gereksinimler

- TMDB `/3` köküne GET isteği gönder ve her URL'ye `language=tr-TR` ekle.
- Her istekte `Authorization: Bearer <token>` başlığı gönder.
- String ve number query parametrelerini ekle, `undefined` olanları atla.
- Başarı cevabının JSON'unu generic dönüş tipi olarak döndür.
- HTTP başarısızlığında hata fırlat: HTTP `status`, TMDB `status_code` veya yoksa `null`, ayrıca `status_message` veya anlaşılır varsayılan mesaj taşısın.
- Bulunmayan film 404 ve TMDB kodu 34 ile hata vermeli.

## Örnek

`get<{ title: string }>('/movie/550')` çağrısı `Dövüş Kulübü` başlığını verir. `'/movie/999999'` çağrısı `status: 404`, `statusCode: 34` değerli hata verir.

## Sözleşme

- Dosya ve export: `tmdbClient.ts` → `ApiError` class ve `createTmdbClient(token: string)` factory.
- Oluşan client: `get<T>(path: string, params?: Record<string, string | number | undefined>): Promise<T>`.
- `ApiError(status: number, statusCode: number | null, message: string)` constructor'ı; alanlar aynı imzayla erişilebilir.

## Kısıtlar

- Token'ı URL query'sine ekleme.
