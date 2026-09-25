---
title: "Bearer başlığıyla profil isteği"
minutes: 8
kind: concept
---

# Bearer başlığıyla profil isteği

:::pain[Sinema’da sorun]
Token Redux’ta var ama profil isteği yine 401. Network sekmesinde `/auth/me` isteğinde `Authorization` başlığı yok.
:::

## İsteğe kanıt ekle

`GET /auth/me` için `Authorization: Bearer <accessToken>` gönder. Token’ı URL query string’ine koyma: URL geçmişe ve log’lara sızabilir. `fetch` hata statülerinde çözülür; `response.ok` değerini kontrol edip anlamlı hata yükselt.

```ts title="src/features/auth/profile.ts"
const response = await fetch('https://dummyjson.com/auth/me', {
  headers: { Authorization: `Bearer ${accessToken}` },
})
if (!response.ok) throw new Error(`Profil alınamadı: ${response.status}`)
```

Bu parça, `accessToken` alan bir `async` fonksiyonun içindedir. Testte başlık eksikse 401 görülür; doğru token’la `emilys` profili gelir.

Bu görevde client yalnız tek isteği yapacak. Geçersiz veya süresi dolmuş token’da 401’i görünür kıl. Sonraki ders, 401’in ardından yeni token alıp aynı isteği güvenli biçimde tekrar deneyecek.

:::mistake[Sık hata]
TMDB’nin `VITE_TMDB_TOKEN` değeri DummyJSON kullanıcı access token’ı değildir. İki API’ye giden Bearer başlıklarının sahibi farklıdır.
:::

:::sector[Sektörde]
Auth header’ı bir API client sınırında eklemek, her component içinde aynı `fetch` kodunu çoğaltmayı önler.
:::
