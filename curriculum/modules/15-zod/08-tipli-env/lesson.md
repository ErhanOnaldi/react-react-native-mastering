---
title: "readConfig şemaya dönüşüyor"
minutes: 8
kind: review
---

# readConfig şemaya dönüşüyor

:::pain[Problem]
Token `.env` içinde var görünüyor ama yalnızca boşluk; ilk istek 401 dönüyor. 0. modüldeki elle yazılmış `readConfig` büyüdü.
:::

## Neden bu araç?

Env değerlerini uygulama açılırken tek kez parse et. `VITE_TMDB_TOKEN` trim sonrası boş olamaz. Başlık için varsayılan, sayfa boyutu için güvenli sayı dönüşümü kullan.

## Sinema'da bir adım ileri

`import.meta.env` TypeScript bildirimi değerin doğru olduğunu garanti etmez. `VITE_` değerleri istemci paketine gömülür; gizli sunucu anahtarları için uygun yer değildir.

## Eski fonksiyondan şemaya

0. modüldeki `readConfig` token'ı trimliyor, başlığı varsayılanlıyor ve sayfa boyutunu kontrol ediyordu. Aynı gereksinimler sürüyor; şimdi tek şema dönüşüm sonucunun tipini de belirliyor.

```ts check
import { z } from 'zod'
const tokenSchema = z.string({ error: 'VITE_TMDB_TOKEN gerekli' })
  .trim().min(1, { error: 'VITE_TMDB_TOKEN gerekli' })
const token = tokenSchema.parse('  test-token  ')
console.log(token)
```

Sayfa boyutunda `z.coerce.number().int().positive()` kullanabilirsin. Geçersiz değerde eski sözleşmeyi koruyup `20` döndürmek için `safeParse` sonucunu kontrol et. Başlıkta trim sonrası boş string ile eksik değeri birlikte ele al; `.default('Sinema')` yalnızca `undefined` için çalışır, boş string için değil.

`import.meta.env` içindeki tip bildirimi sadece editörü bilgilendirir. Zod parse'i çalışan programda değeri denetler. Tarayıcıdaki `VITE_` değişkeni gizli tutulamaz; üretimde gizli anahtarlar sunucuda saklanır.

:::mistake[Sık hata]
`.default("Sinema")` boş stringi değiştirmez; env değerini trimledikten sonra boşluğu ayrıca yönet.
:::

:::sector
Yapılandırma hatalarını uygulama açılışında göstermek sonradan gelen 401 tanısından daha hızlı çözülür.
:::
