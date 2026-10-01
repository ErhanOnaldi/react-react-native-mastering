---
title: "MSW: HTTP sınırındaki perde"
minutes: 15
kind: concept
---

# MSW: HTTP sınırındaki perde

Sinema’daki film kartı veriyi göstermek için `fetch` ile sunucuya istek yollar. Testte bu isteğin doğru adrese gidip doğru cevabı işlemesini görmek istersin; fakat gerçek servise bağlanmak yavaş ve kontrolsüz olur. Mock Service Worker (MSW), test sırasında uzak sunucu gibi davranan araçtır: uygulama normal isteğini yollar, MSW isteği arada yakalar ve tanımladığın cevabı verir.

Buradaki **interception** (isteği arada yakalama), `fetch` fonksiyonunu component içinde değiştirmek değildir. MSW, HTTP isteğinin geçtiği sınırda devreye girer. Böylece URL kurma, `Authorization` başlığı ekleme ve cevabı işleme kodun çalışmaya devam eder.

![Uygulama fetch çağrısından MSW handler cevabına giden istek akışı](diagram:msw-perdesi)

## İlk istek: bir filmin ayrıntısı

Önce sıradan bir film isteği düşün. Component `GET /movie/603` ister. Handler, yani isteğe cevap veren kural, aynı method ve URL biçimi için JSON üretir:

```ts
http.get(`${TMDB_BASE}/movie/:id`, ({ params }) => {
  return HttpResponse.json({ id: Number(params.id), title: 'Matrix' })
})
```

Bu örnekte `http.get` yalnız GET isteklerini eşler. `:id`, yol içinde değişen film numarasıdır; `params.id` handler’a string olarak gelir, bu yüzden sayıya çeviriyoruz. Sonuçta uygulamanın `fetch` çağrısı gerçek sunucuya gitmeden Matrix için cevap alır. Handler’daki JSON, uygulamanın beklediği biçime uymalıdır; yoksa test gerçekte olmayan bir API davranışını doğrular.

İstekten ekrana kadar olan sıra şöyledir:

| Adım | Ne çalışır? | Ne olur? |
|---|---|---|
| 1 | Component `fetch` çağırır | `GET /movie/603` hazırlanır |
| 2 | MSW isteği yakalar | Gerçek ağa çıkmadan test sınırında durur |
| 3 | Handler eşleşir | Method `GET`, yol `/movie/:id` olur |
| 4 | Handler path parametresini okur | `id` değeri `603` olur |
| 5 | `HttpResponse.json` cevap verir | `{ id: 603, title: 'Matrix' }` döner |
| 6 | Component cevabı işler | Kullanıcı ekranda `Matrix` başlığını görür |

MSW bileşenini testin merkezinde tutan nokta budur: sadece cevabın görünmesini değil, uygulamanın kurduğu HTTP isteğinin cevaba ulaşmasını da çalıştırırsın.

## İkinci adım: başlık ve status da isteğin parçası

Film servisi token isteyebilir. **Test double**, testte gerçek bir dış parçanın yerine kullanılan basitleştirilmiş karşılıktır. `fetch`’i doğrudan böyle bir nesneyle değiştirirsen istek URL’i ve başlıkların gerçekten kurulup kurulmadığını atlamış olursun:

```ts
// Bu test double, HTTP isteğinin ayrıntılarını sınamaz.
vi.spyOn(globalThis, 'fetch').mockResolvedValue({
  json: async () => ({ title: 'Kayıp Şehir' }),
} as Response)
```

MSW kullanınca aynı isteğin başlığı handler’a ulaşır. Handler `Authorization` değerinin `Bearer ` ile başladığını ve ardından boş olmayan bir token geldiğini denetleyebilir. Yetki yoksa 401 döndürür; varsa istenen film için cevap verir. Böylece test yalnız `fetch` çağrıldı mı diye değil, uygulama gerekli bilgiyi gönderdi mi diye de bakabilir.

`fetch` için önemli bir ayrım: HTTP 401 veya 404, `fetch` Promise’ini kendiliğinden reddetmez. Promise bir `Response` ile tamamlanır; `response.ok` ise başarısız status’larda `false` olur. Dolayısıyla uygulama status’u ayrıca kontrol etmelidir. `response.json()` gövdeyi okur, status kararını vermez.

## Üçüncü adım: Sinema aramasının cevap biçimi

Bir film araması tek bir film yerine liste ve sayfalama bilgisi döndürebilir. Bu dış alanlara **envelope** (veriyi çevreleyen yanıt yapısı) denir. Örneğin `results` listesinin yanında `page` ve toplam sonuç bilgileri gelir. Handler’ın düz bir dizi döndürmesi uygulamadaki `data.results.map(...)` kullanımını gerçekçi biçimde sınamaz.

```ts
http.get(`${TMDB_BASE}/search/movie`, ({ request }) => {
  const url = new URL(request.url)
  const query = url.searchParams.get('query')

  return HttpResponse.json({
    page: 1,
    results: query === 'Matrix'
      ? [{ id: 603, title: 'Matrix' }]
      : [],
    total_pages: 1,
    total_results: query === 'Matrix' ? 1 : 0,
  })
})
```

Şimdi aynı handler arama metnine göre bir liste ya da boş liste üretir, ama iki yanıtta da envelope biçimi korunur. Bu önemlidir; boş arama hâlâ başarılı bir HTTP cevabıdır ve uygulama aynı `results` alanını okuyabilir. Testte request günlüğü varsa method, URL ve query’yi görebilirsin; bu, ekranda doğru film adının çıktığını kanıtlamaz. Kullanıcıya görünen sonucu ayrıca RTL sorgusuyla doğrula.

## Test server’ının ömrü

Node’daki test ortamında `setupServer` ile MSW server’ı kurarsın. `beforeAll` test dosyası başlamadan dinlemeye açar, `afterEach` testin eklediği geçici handler’ları `resetHandlers()` ile temizler, `afterAll` dosya bitince server’ı kapatır. Başlangıç handler’ı ortak kalır; `server.use(...)` ile eklediğin özel cevap testler arasında sızmamalıdır.

Tanımsız bir istek gerçek internete kaçmamalı. `server.listen({ onUnhandledRequest: 'error' })` bunu test hatasına çevirir. Örneğin handler `/movie/:id` beklerken uygulama `/movies/550` çağırıyorsa bu uyuşmazlığı hemen görürsün. Belirti “unhandled request” olur; nedeni method veya URL’in eşleşmemesidir. Günlükteki isteği okuyup handler yolunu gerçek istekle eşleştir.

:::mistake[Handler gövdesi yanlış biçimde]
Belirti → Film listesi boş görünür ya da `results.map` satırı hata verir.
Neden → Handler, API’nin `{ results: [...] }` yapısı yerine doğrudan dizi döndürmüştür.
Düzeltme → Uygulamanın gerçekten okuduğu alanları içeren response biçimini üret.
:::

:::mistake[Bir testin override’ı sızar]
Belirti → Tek başına geçen test, testler birlikte çalışınca beklenmedik 500 alır.
Neden → `server.use` ile eklenen handler testten sonra sıfırlanmamıştır.
Düzeltme → `afterEach` içinde `server.resetHandlers()` çağır.
:::

:::info[Derinlemesine (isteğe bağlı)]
Tarayıcıda MSW, Service Worker adlı tarayıcı arka plan mekanizmasıyla istekleri yakalayabilir. Node’daki test server’ı bu tarayıcı yaşam döngüsünü kullanmaz; iki ortamda da uygulamanın `fetch` kodu aynı kalır. Bu ayrıntı test handler’ı yazmak için gerekli değildir.
:::

## Özet

- MSW uzak sunucu cevabını taklit eder; uygulamanın normal `fetch` akışı çalışır.
- Handler method ve URL ile eşleşir; query, path parametresi ve başlık istekten okunabilir.
- HTTP 401/404 `fetch` Promise’ini reddetmez; `response.ok` kontrolünü uygulama yapar.
- Handler cevabının alanları gerçek API biçimine uymalıdır.
- Geçici handler’ları her testten sonra temizle; tanımsız istekleri hata say.

**Yeni terimler**

- **Interception:** Bir HTTP isteğini gerçek sunucuya gitmeden arada yakalama.
- **Handler:** Belirli isteğe nasıl cevap verileceğini tanımlayan kural.
- **Test double:** Testte dış bir parçanın yerine kullanılan basit karşılık.
- **Envelope:** Asıl veriyi ve sayfa gibi ek bilgileri birlikte taşıyan yanıt yapısı.

**Kendini yokla:** 401 geldiğinde neden `.catch(...)` tek başına hata durumunu yakalamaz?
*Cevap:* HTTP 401 bir `Response` olarak gelir; uygulama `response.ok` değerini kontrol etmelidir.

**Kendini yokla:** Handler doğru JSON’u veriyor ama uygulama yine çöküyorsa ilk neyi karşılaştırırsın?
*Cevap:* Handler’ın alan adlarını ve iç içe yapısını, uygulamanın okuduğu response biçimiyle karşılaştırırım.
