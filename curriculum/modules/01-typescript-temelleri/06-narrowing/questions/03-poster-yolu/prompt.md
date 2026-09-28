Görsel sunucusuna istek atmadan önce poster dosya yolunu normalize etmek istiyoruz. `posterPath` fonksiyonu, `null` ve boş değerleri ele almalı ve geçerli yolların başında mutlaka `/` karakteri bulunmasını sağlamalıdır.

## Gereksinimler

- Verilen yol `null` veya boş metin (`""`) ise `null` döndürülmelidir.
- Yol zaten `/` ile başlıyorsa olduğu gibi korunmalıdır (ör. `"/x.jpg"` → `"/x.jpg"`).
- Yol `/` ile başlamıyorsa başına `/` eklenmelidir (ör. `"x.jpg"` → `"/x.jpg"`).
- `null` parametre geldiğinde fonksiyon çalışma zamanında hata fırlatmadan güvenle `null` dönmelidir.

## Örnek

| Girdi (`path`) | Çıktı |
| --- | --- |
| `null` | `null` |
| `""` | `null` |
| `"/x.jpg"` | `"/x.jpg"` |
| `"x.jpg"` | `"/x.jpg"` |

## Sözleşme

- Dosya ve export: `posterPath.ts` → `posterPath(path: string | null): string | null`
