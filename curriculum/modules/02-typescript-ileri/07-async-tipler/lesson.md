---
title: "Promise’in tipi ve ağdaki gerçek"
minutes: 9
kind: concept
---

# Promise’in tipi ve ağdaki gerçek

:::pain[Problem]
`getJson<Movie>('/movie/550')` yazınca editör `Movie` gösterdi. Sunucu 401 hata JSON'u döndürdüğünde tip yeşil kaldı, ekran ise çöktü.
:::

## Asenkron tür ile gerçek cevabı ayır

`Promise<T>`, gelecekte tamamlanacak bir işlemin başarılı değer tipini anlatır. `async` fonksiyon doğrudan değer döndürse bile çağırana Promise verir; `await` bu sonucu bekleyip işleme devam etmeyi sağlar. Bu tip, işlemin ne zaman tamamlanacağını veya dış servisin gerçekten `T` biçiminde cevap verdiğini garanti etmez.

Generics ile cevap tipini taşımayı ve `unknown` veriyi kontrol etmeyi öğrendin. Ağ isteğinde ikisi birlikte gerekir: `getJson<Movie>` kod içindeki beklentiyi ifade eder, HTTP durumu ve cevap gövdesi ise ayrıca incelenir. Sinema'daki hata cevabı, tip açıklaması ile çalışma zamanı gerçeği arasındaki farkı gösterir.

## Async imza

`async` fonksiyon `Promise<T>` döndürür. `await` Promise içindeki değeri verir. `ReturnType` fonksiyonun dönüşünü, `Parameters` parametre tuple'ını, `Awaited` ise Promise içindeki sonucu çıkarır.

```ts check
async function loadTitle(id: number): Promise<string> { return String(id) }
type LoaderResult = ReturnType<typeof loadTitle>
type ResolvedTitle = Awaited<LoaderResult>
type LoaderArgs = Parameters<typeof loadTitle>
const args: LoaderArgs = [550]
const title: ResolvedTitle = 'Dövüş Kulübü'
```

`getJson<T>` yazmak çağıranın bir **iddiasıdır**. `response.json()` ağdan gelen veriyi doğrulamaz. Ayrıca `fetch` 404/401 için kendiliğinden hata fırlatmaz; `response.ok` kontrolü gerekir.

## Gerçek sınır

TMDB'nin test ortamı `Authorization: Bearer test-token` ister. İstek başarısızsa hata cevabını başarı gibi yorumlama. `getJson<T>` örneğinde tipin güven sınırını açıkça tut; 15. modülde Zod ile `unknown` veriyi doğrulayacağız.

:::sector
`ReturnType` ve `Awaited` mevcut async fonksiyonların imzasını yeniden yazmadan türetir. Dış verinin doğruluğunu yine çalışma zamanı kontrolü sağlar.
:::
