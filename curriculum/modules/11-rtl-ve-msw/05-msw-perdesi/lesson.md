---
title: "MSW: HTTP sınırındaki perde"
minutes: 16
kind: concept
---

# MSW: HTTP sınırındaki perde

:::pain[Problem]
Test ortamında uygulama `fetch('/api/weather')` çağırıyor. Gerçek ağa çıkmıyor ama ekranda “18°” görünüyor. Yanlış URL’e gidildiğinde ise test hata veriyor. Cevabın nereden geldiğini anlamazsan bu davranış sihir gibi kalır ve ağ sınırında neyi test ettiğini bilemezsin.
:::

## İstek uygulamadan çıkar, ağ sınırında cevap alır

Mock Service Worker (MSW), uygulamanın `fetch` çağrısını bileşenin içinde değiştirmez. İstek, uygulamanın kullandığı normal HTTP yolunda ilerler; MSW o isteği yakalar ve eşleşen handler’dan yanıt üretir. Bu sayede testin uygulama kodu gerçek `fetch`, URL, method, header ve response işlemlerini kullanmaya devam eder. Taklit edilen yer uzak sunucudur.

Bu ortak zihinsel model, modülün geri kalanında taşıyıcıdır:

1. **Uygulama isteği kurar.** Örneğin `fetch('/api/weather?city=Ankara')` çağrısı URL ve method taşır.
2. **İstek MSW sınırına gelir.** Test ortamında MSW bu HTTP isteğini yakalar; uygulama `fetch`’i veya component fonksiyonunu bilerek taklit etmez.
3. **Handler eşleşir.** Method ve URL pattern’i handler’a uymalıdır. Parametreler ve query değerleri request üzerinden okunur.
4. **Handler response üretir.** JSON, status, header veya gecikme gibi sunucu davranışı burada seçilir.
5. **Uygulama normal cevap gibi işler.** Response parse edilir; başarı ya da hata görünür UI state’ine dönüşür.
6. **Handler bulunmazsa test başarısız olur.** Bilinmeyen istek gerçek internete kaçmamalıdır.

![Uygulama fetch çağrısından MSW handler cevabına giden istek akışı](diagram:msw-perdesi)

Modelin önemli sonucu şudur: MSW, API’yi taklit eder; uygulamanın request oluşturma ve response işleme kodunu değil. Test de kullanıcıya görünen sonucu ve gerekirse isteğin doğru hedefe gittiğini doğrulayabilir. Bütün fetch’i `vi.fn()` yapmak, bu HTTP sınırındaki etkileşimi atlayıp yalnızca mock kurulumu ile uygulama fonksiyonu arasındaki sözleşmeyi sınar.

## Handler’ın eşleşmesini ve cevabını izle

Bir hava durumu paneli `GET /api/weather?city=Ankara` atsın. İstek sırası:

| Adım | Kim çalışıyor? | Veri |
|---|---|---|
| 1 | `fetch` çağrısı | URL `/api/weather?city=Ankara`, method `GET` |
| 2 | MSW request interception | İstek gerçek ağa ulaşmadan yakalanır |
| 3 | `http.get` handler eşleşmesi | Method GET ve route `/api/weather` eşleşir |
| 4 | Handler query okur | `city` değeri `Ankara` olur |
| 5 | `HttpResponse.json` | `{ city: 'Ankara', celsius: 18 }` gövdesi döner |
| 6 | Component response’u işler | JSON parse edilir; ekranda `18°C` görünür |

MSW 2 API’sinde `http.get`, `http.post` gibi handler tanımlayıcıları ile `HttpResponse.json` gibi response üreticileri kullanılır. `request.url` bir URL’dir; query bilgisi `new URL(request.url).searchParams` ile okunur. Path parametresi `params` içinden gelir ve string tipindedir. Handler’ın verdiği JSON’un biçimi, uygulamanın gerçek API sözleşmesine uymalıdır; yalnızca testte kullanılan kolay bir gövde üretmek sahte başarıya yol açar.

## Uygulamayı mock etmeden HTTP davranışı üret

Aşağıdaki kırık yaklaşım uygulama modülündeki `fetch` fonksiyonunu bir test double ile değiştirir:

```ts
// Kırık sınır: URL, header ve gerçek Response işleme yolu atlanır.
vi.spyOn(globalThis, 'fetch').mockResolvedValue({ json: async () => ({ celsius: 18 }) } as Response)
```

Bu kurulumda yanlış URL, eksik `Authorization` header’ı veya bozuk status kontrolü fark edilmeyebilir. Sunucu yanıtını ağ sınırında değiştir:

```ts check
import { http, HttpResponse } from 'msw'
import { setupServer } from 'msw/node'
import { afterAll, afterEach, beforeAll, describe, expect, it } from 'vitest'

const WEATHER_BASE = 'https://weather.example.test'
const server = setupServer()

beforeAll(() => server.listen({ onUnhandledRequest: 'error' }))
afterEach(() => server.resetHandlers())
afterAll(() => server.close())

describe('hava durumu API cevabı', () => {
  it('şehir için tanımlı cevabı döndürür', async () => {
    server.use(
      http.get(`${WEATHER_BASE}/weather`, ({ request }) => {
        const city = new URL(request.url).searchParams.get('city')
        return HttpResponse.json({ city, celsius: 18 })
      }),
    )

    const response = await fetch(`${WEATHER_BASE}/weather?city=Ankara`)
    expect(await response.json()).toEqual({ city: 'Ankara', celsius: 18 })
  })
})
```

Burada kullanılan `@test-utils` altyapısının `server` ve `WEATHER_BASE` dışa aktardığı varsayılmıştır; kavramsal örneğin uygulama kodundan farklı bir domain kullanması, gerçek projedeki modüle kopyalanacağı anlamına gelmez. Handler’ı bir testte `server.use(...)` ile eklenen geçici davranış olarak düşün. Ortak varsayılan handler’lar server kurulumunda tutulabilir.

`requests()` gibi günlük yardımcıları test ortamına özeldir. Bunlar uygulamanın yaptığı istekleri görmene yardımcı olur: method, tam URL, path ve query. Ancak yalnızca istek günlüğünü assert etmek, ekranda doğru sonucun görüldüğünü kanıtlamaz. UI davranışı için RTL sorgusunu da test et. Ağ günlüğü, davranış testini tamamlar; yerine geçmez.

## Gerçekçi cevap, gerçekçi sınır

MSW handler’ı istediğin cevabı üretebilir; bu esneklikle gerçek API’nin status ve gövde biçimini korumalısın. Örneğin 404, `Response` olarak resolve olur. Uygulama yalnızca `.json()` çağırıp `response.ok` kontrol etmiyorsa 404 gövdesini başarı gibi gösterebilir. Bu durumda handler doğru çalışsa da UI hatalıdır.

Handler eşleşmiyorsa `onUnhandledRequest: 'error'` ayarı testin kırmızı olmasını sağlar. Bu, test izolasyonunun korumasıdır: tanımsız bir URL’e gerçek ağa çıkma ihtimali bırakmaz. Bir endpoint’i bilerek kapsam dışı bıraktıysan davranışını açıkça mock et veya isteğin yapılmaması gereken koşulu doğrula; unhandled request’i susturup testi yeşil yapma.

MSW’nin Node ve tarayıcı kullanımı yaşam döngüsünde ayrılır. Node testlerinde `setupServer` kurulur; testlerden önce `listen`, her test sonrası `resetHandlers`, dosya tamamlanınca `close` yapılır. Tarayıcı önizlemesi Service Worker ile istekleri yakalar. Her iki ortamda da uygulamanın yaptığı fetch kodu aynı kalır; yakalama altyapısı değişir.

:::mistake[Yanlış base URL]
Belirti → Handler tanımlı görünüyor, fakat test “unhandled request” hatası veriyor.  
Neden → Uygulamanın kullandığı origin/path ile handler URL’i birebir uyuşmuyor veya method farklı.  
Düzeltme → Günlükteki method ve URL’i oku; handler eşleşmesini aynı gerçek istek şekline göre düzenle.
:::

:::mistake[Handler gövdesi API biçiminden farklı]
Belirti → Testte liste boş görünüyor ya da kod `results.map` satırında çöküyor.  
Neden → Handler, gerçek API’nin liste envelope’u yerine düz bir dizi döndürmüş.  
Düzeltme → Uygulamanın tükettiği gerçek response biçimini (`{ results: [...] }` gibi) üret.
:::

:::mistake[Handler’ı testler arasında bırakmak]
Belirti → Bir testteki 500 override’ı sonraki testte de görülüyor.  
Neden → Runtime handler reset edilmemiş.  
Düzeltme → Test lifecycle’ında `server.resetHandlers()` çalıştır; her senaryo kendi kurulumunu yapsın.
:::

## İstek başlığını ve response durumunu aynı akışta tut

Uygulama `Authorization: Bearer ...` gönderiyorsa bu başlık, ağ isteğinin parçasıdır. Testte MSW, hem başlığın gidişini hem server cevabını sınamaya elverişli bir sınır sağlar. Varsayılan fixture 401 döndüğünde UI’ın hata durumuna geçmesi, uygulamanın gerçek auth akışını kullandığına dair kanıttır. Handler’ı doğrudan çağırmak ise uygulamanın header’ı eklediğini göstermez.

`requests()` günlüğü request’i yakaladığı anda oluşur; server’ın ne döndürdüğünden bağımsızdır. Bu nedenle yetkisiz request de günlükte görünür. Günlükte tam URL yerine path sorgulamak sabit origin’e gereksiz bağlanmayı azaltabilir; query gerekiyorsa `searchParams` değerini karşılaştır. Yalnızca request sayısını doğrulamak bileşenin response’u parse ettiğini veya DOM’u güncellediğini söylemez.

Handler tasarımında cevap gövdesini gerçek domain’e benzet. Bir film listesi `{ page, results, total_pages, total_results }` biçimindeyse handler aynı yapıyı döndürsün. `results` boşsa bile envelope’un diğer alanları yerinde kalsın. Gerçek API’deki nullable alanları fixture’da da gerektiğinde kullan; her filmde poster bulunduğunu varsaymak boş veri sınırını test dışına iter.

Test lifecycle’ı içinde `beforeAll` server’ı dinlemeye açar, `afterEach` runtime handler’ları sıfırlar ve RTL cleanup’ı yürütür, `afterAll` server’ı kapatır. Bu üç anı karıştırma: server her test öncesi yeniden kurulmaz; runtime override ise testler arasında kalmamalıdır. Bu düzen testleri sıraya bağımlı olmaktan çıkarır.

:::model[Test katmanları]
MSW’li bir React testi çoğunlukla entegrasyon katmanındadır: gerçek component davranışı, DOM ve router birlikte çalışır; yalnızca dış HTTP yanıtı taklit edilir. Gerekli olmayan browser/host katmanlarını ekleme; bu yeni bağlamda dış sistem sınırı HTTP servisidir.
:::

:::sector
Ürün ekipleri ortak başarılı API yanıtlarını fixture veya varsayılan handler’larda tutar; hata, boş liste ve sıra dışı yanıtları ilgili testte override eder. Handler’lar gerçek sözleşmeyi temsil ettiğinde aynı senaryo component, router ve bazen tarayıcı testinde yeniden kullanılabilir.
:::

## Özet

- MSW, uygulamanın normal HTTP isteğini dış sistem sınırında yakalar.
- Handler method ve URL ile eşleşir; request’ten path, query ve header okunur.
- JSON biçimi ve status gerçek API sözleşmesine uymalıdır.
- Tanımsız istekler test hatası olmalı; gerçek ağa kaçmamalıdır.
- Runtime override’ları testler arasında reset et.

**Kendini yokla:** MSW kullanırken uygulama kodundaki `fetch` neden çalışmaya devam eder?  
*Cevap:* MSW fetch’i bileşen içinde değiştirmez; isteği HTTP sınırında yakalar.

**Kendini yokla:** 404 yanıtını handler üretmişse uygulama neden yine hata gösterebilir?  
*Cevap:* `fetch` 404’te reject etmez; uygulama `response.ok` durumunu kontrol etmelidir.
