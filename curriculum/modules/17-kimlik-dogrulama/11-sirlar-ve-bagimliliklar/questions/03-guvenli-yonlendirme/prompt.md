Girişten sonra kullanıcıyı istediği uygulama sayfasına döndür. Dış siteye giden veya geçersiz dönüş adresini varsayılan sayfayla değiştir.

## Gereksinimler

- Yalnız `/` ile başlayan, `//` ile başlamayan uygulama içi yollar kabul edilir.
- Ters eğik çizgi ve kontrol karakteri içeren yollar reddedilir.
- Metin olmayan, boş, göreli ve dış adresler fallback döndürür.
- Geçerli yol query ve hash bölümleriyle birlikte aynen korunur.

## Örnek

| Girdi | Çıktı |
| --- | --- |
| `/watchlists?sort=new` | `/watchlists?sort=new` |
| `//evil.example/login` | `/profile` |
| `https://evil.example` | `/profile` |

## Sözleşme

`getSafeRedirect.ts` → `getSafeRedirect(value: unknown, fallback?: string): string` named export; varsayılan fallback `/profile`.

