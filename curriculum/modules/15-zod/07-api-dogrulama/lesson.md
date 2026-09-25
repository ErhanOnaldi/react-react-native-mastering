---
title: "API sınırında doğrula"
minutes: 8
kind: concept
---

# API sınırında doğrula

:::pain[Problem]
TMDB 200 döndü ama `title: null`; Query başarılı saydı, detay başlığında `.toUpperCase()` çöktü.
:::

## Neden bu araç?

HTTP başarısı veri şeklinin doğruluğu değildir. `response.json()` sonucunu `unknown` al, API client içinde şemayla parse et. Böylece Query hata durumuna geçer ve UI kontrollü hata gösterir.

## Sinema'da bir adım ileri

`z.treeifyError(error)` alan bazlı hata ağacı, `z.prettifyError(error)` okunur tanı metni verir. Kullanıcıya servis ayrıntısı sızdırmadan anlaşılır mesaj göster; geliştirici logunda alan yolunu koru.

## Bozuk yanıtı görünür kıl

MSW testinde `server.use` ile `/movie/550` yanıtını 200 ve `{ id: 550, title: null }` yapabilirsin. Bu gerçekçi bir sözleşme ihlalidir: HTTP katmanı başarılıdır, veri katmanı değildir. Eski `get<T>` parse etmediğinden Query sonucu başarı kabul eder; sayfa çöküşü daha sonra gelir.

```ts check
import { z } from 'zod'
const detailsSchema = z.object({ id: z.number(), title: z.string() })
function decodeDetails(raw: unknown) { return detailsSchema.parse(raw) }
const result = detailsSchema.safeParse({ id: 550, title: null })
if (!result.success) console.log(z.prettifyError(result.error))
void decodeDetails
```

API client içinde önce HTTP durumunu kontrol et, sonra JSON'u `unknown` olarak oku, son olarak şemayla parse et. Bu sırayla 404 `ApiError` olarak kalır; 200 içindeki bozuk veri şema hatası olur. `z.treeifyError` alan yoluna göre UI hata mesajı üretmek için, `z.prettifyError` tanı/log için uygundur.

:::mistake[Sık hata]
`response.ok` kontrolü JSON alanlarının doğru tipte olduğunu kanıtlamaz.
:::

:::sector
Client sınırında oluşan parse hatası Query’nin hata durumuna taşınır; UI genel hata bileşenini kullanabilir.
:::
