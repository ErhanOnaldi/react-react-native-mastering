---
title: "Bearer başlığıyla profil isteği"
minutes: 8
kind: concept
---

# Bearer başlığıyla profil isteği

:::pain[Sinema’da sorun]
Token Redux’ta var ama profil isteği yine 401. Network sekmesinde `/auth/me` isteğinde `Authorization` başlığı yok.
:::

## Token'ı doğru isteğe bağla

Access token, sunucunun koruduğu bir kaynağa istekte kimlik bilgisini taşır. Bearer şeması bu değeri `Authorization` başlığında gönderir; token'ı URL'ye koymak geçmiş ve log gibi yerlerde görünmesine yol açabilir. Başlık eklemek yine de isteğin başarılı olacağı anlamına gelmez: sunucu token'ı doğrular ve gerekirse 401 döndürür.

Önceki derste token'ı sakladın, şimdi onu yalnız ait olduğu API'ye gönderiyorsun. Sinema'nın TMDB token'ı ile DummyJSON kullanıcı token'ını ayırmak burada zorunlu. API client sınırı, başlık kuralını her component'e kopyalamadan uygular.

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
