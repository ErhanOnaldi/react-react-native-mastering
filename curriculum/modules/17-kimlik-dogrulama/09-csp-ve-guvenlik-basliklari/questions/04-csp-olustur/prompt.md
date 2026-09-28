Modern web uygulamalarında Content-Security-Policy (CSP) başlığı, tarayıcının hangi kaynaklardan script, görsel, stil veya API verisi yükleyebileceğini belirler. Verilen yönerge ve kaynak haritasını geçerli bir CSP başlık dizesine dönüştüren bir yardımcı fonksiyon oluştur.

## Gereksinimler

- Her yönerge anahtarı ve karşılık gelen kaynaklar `"<yönerge> <kaynak1> <kaynak2>"` biçiminde tek bir kural haline getirilmelidir.
- Kurallar birbirine `"; "` (noktalı virgül ve bir boşluk) ile bağlanmalıdır.
- Kaynak dizisi boş (`[]`) veya `undefined` olan yönergeler sonuca dahil edilmemelidir.
- Kaynak dizelerindeki baştaki ve sondaki boşluklar temizlenmeli; boş dizgiler elenmelidir.
- Hiçbir geçerli yönerge bulunmuyorsa boş metin (`""`) döndürülmelidir.

## Örnek

| Girdi | Çıktı |
| --- | --- |
| `{ 'default-src': ["'self'"] }` | `"default-src 'self'"` |
| `{ 'default-src': ["'self'"], 'img-src': ["'self'", 'https://image.tmdb.org'] }` | `"default-src 'self'; img-src 'self' https://image.tmdb.org"` |
| `{ 'default-src': ["'self'"], 'font-src': [] }` | `"default-src 'self'"` |
| `{}` | `""` |

## Sözleşme

- `buildCsp.ts` dosyasından `buildCsp(directives: CspDirectives): string` fonksiyonunu named export et.
- `CspDirectives` tipi `Record<string, string[] | undefined>` olmalıdır.
