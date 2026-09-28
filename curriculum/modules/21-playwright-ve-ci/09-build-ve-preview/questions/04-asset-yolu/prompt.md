Bir uygulama bazen alan adının kökünde, bazen `/festival/` altında yayınlanıyor. Build dosyalarının bağlantıları her iki durumda da doğru adrese gitmeli.

## Gereksinimler

- Kök yol `/` ise asset bağlantısı tek `/` ile başlar.
- Alt yol verilirse bağlantı o yolun altında kalır; başta, sonda ve birleşme yerinde çift `/` oluşmaz.
- Asset dosyasının adı ve hash bölümü değişmeden korunur.

## Örnek

| Yayın kökü | Asset | Sonuç |
| --- | --- | --- |
| `/` | `assets/main-a41c.js` | `/assets/main-a41c.js` |
| `/festival/` | `/assets/main-a41c.js` | `/festival/assets/main-a41c.js` |
| `festival` | `assets/theme-b82d.css` | `/festival/assets/theme-b82d.css` |

## Sözleşme

- `assetHref.ts` dosyası `assetHref(basePath: string, assetPath: string): string` export eder.
