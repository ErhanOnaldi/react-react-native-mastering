Sinema uygulamasının tüm sayfaları harici film veritabanı ile aynı taban adresi, yetkilendirme kuralları ve hata işleme mantığı üzerinden haberleşmelidir. Tüm isteklerin ortaklaştığı bir API istemci yardımcısı oluştur.

## Gereksinimler

- Taban adres ile verilen istek yolu birleştirilerek tam bir istek adresi oluşturulmalıdır.
- Her isteğe varsayılan olarak Türkçe dil tercihi (`language=tr-TR`) eklenmelidir; parametrelerde başka bir dil verilmişse bu tercih korunmalıdır.
- Sayı ve metin türündeki sorgu parametreleri istek adresine dahil edilmeli; `undefined` olan parametreler elenmelidir.
- İstek başlıklarında ortam değişkeninden okunan erişim anahtarı (`Bearer` token) gönderilmelidir.
- İstek seçenekleri (`init`) bozulmadan temel çağrıya aktarılmalı; varsa iptal sinyali gibi ek ayarlar korunmalıdır.
- Başarılı HTTP yanıtlarında (2xx) gövde çözümlenerek istenen türde döndürülmelidir.
- Başarısız HTTP yanıtlarında (`!response.ok`) başarısız olan durum ya da sunucunun hata açıklaması bir hata olarak fırlatılmalıdır.

## Örnek

```ts
const movie = await tmdbFetch<MovieDetails>('/movie/550', {
  append_to_response: 'credits,videos',
})
// movie.title === "Dövüş Kulübü"
// movie.credits içinde oyuncu listesi bulunur
```

Bulunamayan bir film kimliği verildiğinde (ör. `/movie/999999`) fonksiyon başarılı veri döndürmek yerine hata fırlatır.

## Sözleşme

- Dosya ve export: `src/lib/tmdb.ts` → `TMDB_BASE_URL: string` (değeri `'https://api.themoviedb.org/3'`)
- Dosya ve export: `src/lib/tmdb.ts` → `tmdbFetch<T>(path: string, params?: Record<string, string | number | undefined>, init?: RequestInit): Promise<T>`
- Yetkilendirme: `Authorization: Bearer ${import.meta.env.VITE_TMDB_TOKEN}`

## Kısıtlar

- Gerçek erişim anahtarınızı veya `.env` dosyanızı git deposuna eklemeyin; test ortamı sahte anahtarı otomatik sağlar.
