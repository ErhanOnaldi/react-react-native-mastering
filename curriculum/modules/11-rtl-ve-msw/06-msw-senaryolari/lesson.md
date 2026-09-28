---
title: "Tek testte farklı sunucu cevapları"
minutes: 13
kind: concept
---

# Tek testte farklı sunucu cevapları

:::pain[Problem]
Normal cevapla çalışan hava durumu panelinde hata tasarımını göremiyorsun. Sunucu hız sınırına ulaşıp 429 verdiğinde kullanıcıya “Hava durumu alınamadı” gösterilmesi gerekiyor. Gerçek servisi bozmak güvenli değil; uygulama içindeki `fetch` mock’u ise URL ve gerçek response davranışını atlıyor.
:::

## Handler’ı yalnızca gereken senaryoda değiştir

11.5’te kurduğumuz `diagram:msw-perdesi` modeli geçerli: uygulama normal isteği yollar, MSW yakalar ve handler cevap verir. Burada değişen, handler’ın ömrü ve cevabıdır. Bir test için normal handler’ı geçici olarak gölgeleyebilir, gecikme, boş liste, 500 veya başka bir status üretebilirsin. `server.use(...)` runtime handler ekler; lifecycle sonunda `resetHandlers()` ile başlangıçtaki handler setine dönülür.

Kurallar:

1. **Varsayılanı ortak tut.** Çoğu testte geçerli olan başarı cevabını başlangıç handler’ı olarak tanımla.
2. **Özel senaryoyu yalnız ilgili testte override et.** Böylece 500 cevabı başka teste sızmaz.
3. **Handler’ı method, URL ve response sözleşmesiyle tarif et.** Hata yanıtı yalnız status’tan ibaret değildir; kullanıcıya gösterilecek mesajı tetikleyecek gövde de gerçeğe uymalıdır.
4. **Gecikmeyi yalnız zaman davranışı gözlenecekse kullan.** Yüklenme ekranının kalıcı görünmesini veya yarış sırasını ölçmek için kontrollü gecikme gerekir; her handler’ı yavaşlatma.
5. **Gecikme sonrası veriyi isteğin kendisinden oku.** Path/query farklılığı cevapta farklı sonuç üretmeli; böylece yanlış URL sessizce başarıya dönüşmez.
6. **Handler reset’ini garanti et.** Testler birbirinden bağımsız olmalı; sıra değişince cevap değişmemelidir.

## Aynı component, üç sunucu gerçeği

Bir kütüphane aramasında component değişmeden üç response olabilir: sonuç var, eşleşme yok veya servis hata verdi. Asenkron test modelini hatırla: kullanıcı önce yükleniyor durumunu görür, sonra response’un anlamına göre başarı, boş veya error görünümüne geçer. Bu senaryoların her biri aynı UI’ı gerçek fetch hattından çalıştırmalıdır.

| Handler yanıtı | HTTP sonucu | Uygulamada beklenen kullanıcı davranışı |
|---|---|---|
| `{ entries: [{ id: 8, label: 'Ada' }] }` | 200 | “Ada” başlıklı sonuç görünür |
| `{ entries: [] }` | 200 | “Eşleşme yok” durumu görünür |
| `{ message: 'Servis kullanılamıyor' }` | 429 | Erişilebilir hata görünümü görünür |

Önemli ayrım: boş sonuç bir sunucu hatası değildir. HTTP 200 ve boş liste, aramanın başarıyla tamamlandığını ama eşleşme olmadığını söyler. 503 ise istek beklenen biçimde sonuçlanmadı demektir. Arayüzün “hiç sonuç yok” ile “sonuç alınamadı”yı aynı metinde toplaması kullanıcıyı yanlış yönlendirir.

## Yanlış handler, sonra doğru handler

Bu test sunucu davranışını değil, uygulamanın `fetch` fonksiyonunu değiştiriyor:

```ts
// Kırık: URL ve HTTP status yolu atlanıyor.
vi.spyOn(globalThis, 'fetch').mockResolvedValue({ ok: false } as Response)
```

Bunun yerine yalnız endpoint cevabını değiştir. Aşağıdaki kodda handler hem status hem JSON gövdesi döndürür:

```ts
server.use(
  http.get(`${WEATHER_BASE}/weather`, () =>
    HttpResponse.json({ message: 'Servis kullanılamıyor' }, { status: 503 }),
  ),
)
```

Sonra test `render(...)` ile component’i çalıştırır ve `await screen.findByRole('alert')` ile kullanıcıya gösterilen hatayı bekler. Handler’ı doğrudan `fetch` ile çağırıp status’un 503 olduğunu doğrulamak handler’ın kendisi için doğru olabilir; component’in hatayı görünür kıldığını kanıtlamaz. Bu iki sorumluluğu karıştırma.

## Tek istekte bozuk veri, fakat temiz senaryo

İstek detaylarını test eden yardımcılar (`requests()` gibi) aynı test altyapısında bulunabilir. Örneğin `limit=2.5` gibi tam sayı olmayan bir değer için 400 üretmek, istek parametresi sınırını görünür kılar. Handler query’yi string olarak alır; sayıya çevirme ve integer kontrolü handler’ın kendi işidir. Geçersiz değeri sessizce 2’ye düzeltmek gerçek API’nin hatasını gizleyebilir.

Bir yanıtı bekletmek, yavaş servis koşulunda loading ekranını gözlenebilir yapar; ürünün gerçek ağ hızını ölçmez. Gereksiz uzun bekleme doğrulama süresini artırır. Sonucu status veya başlık görünürlüğüne bağla; “tam 80 ms sonra metin geldi” gibi duvar saati iddiası kurma.

:::model[Yarış koşulu]
Eski isteğin cevabı yeni isteğin ardından gelebilir. Yavaş server cevabı ile bu bitiş sırasını sınayabilirsin; component’in eski cevabı uygulamaması hâlâ kendi sorumluluğudur.
:::

![Uygulama isteğinden handler cevabına MSW akışı](diagram:msw-perdesi)

## Sınır durumları

:::mistake[Belirti: 500 testi yeşil ama hata görünmüyor]
Belirti → Handler’dan 503 dönüyor, fakat ekranda başlık ya da boş liste durumu var.  
Neden → Uygulama `fetch` Response’unu yalnız JSON olarak parse etmiş; `response.ok` kontrol etmemiş.  
Düzeltme → HTTP status’u uygulama hata state’ine çevir; testte role=`alert` ve kullanıcı mesajını bekle.
:::

:::mistake[Belirti: Override sonraki testi etkiliyor]
Belirti → Tek başına geçen test, önceki testle birlikte çalışınca beklenmeyen boş liste alıyor.  
Neden → Ortak mutable state veya handler reset edilmemiş.  
Düzeltme → `server.resetHandlers()` lifecycle’da çağrılsın; özel cevabı her test kendi kurulumunda eklesin.
:::

:::mistake[Belirti: Yükleme durumu arada görünmüyor]
Belirti → `getByRole('status')` bazen öğeyi bulamıyor.  
Neden → Handler cevabı test assertion’ından önce tamamlanmış.  
Düzeltme → Loading’i test edeceksen o handler’a kontrollü gecikme koy; sadece son sonucu test ediyorsan ara state’i zorunlu kılma.
:::

## Handler kapsamı ve eşleşme sırası

MSW handler’ları method ve URL pattern’ine göre istekle eşleşir. `http.get` tanımlı bir handler, POST isteğini karşılamaz. Path segmenti `:id` gibi değişkense handler içindeki parametre string gelir; numeric id bekleyen kod önce dönüşüm yapmalıdır. Query string path pattern’inin parçası değildir; `request.url` üzerinden ayrıca okunur. Bu ayrım, özel bir test verisinin yanlış route’a bağlanmasının önüne geçer.

Runtime override’ın amacı ortak cevabı kalıcı değiştirmek değil, tek bir testte farklı server gerçeği üretmektir. Bir test içindeki iki istek için önce 503 sonra 200 gerekiyorsa handler cevap sayacı tutabilir veya çağrı sırasına göre yanıt seçebilir; ancak bu state yalnız o test içinde kurulmalıdır. Mümkünse stateful davranış yerine request URL’i, header’ı veya query’yi kullanarak cevabı belirle. Böylece test daha az kırılgan olur.

Üç hata kaynağını da ayır: handler 503 döndürürse HTTP response vardır; bağlantı hatası simüle edilirse uygulamanın fetch Promise’i reject olabilir; handler tanımsızsa test altyapısı unhandled request hatası üretir. Bunlar ürün UI’ında aynı “Hizmet şu anda kullanılamıyor” mesajına dönüşebilir, ancak testteki setup farklıdır. `HttpResponse.error()` gibi network error davranışı gerekiyorsa yalnızca testinin gerçekten o yolu doğruladığından emin ol.

Kontrollü gecikme, server cevabı gelmeden geçen zamanı görünür kılar. Response dönene kadar component loading durumundadır; response geldikten sonra JSON parse ve state update tamamlanır, ardından DOM değişir. Gecikme süresiyle DOM’u bekleme koşulunu ayrı kavramlar olarak düşün: biri sunucu davranışını temsil eder, diğeri arayüzün beklenen sonucunu.

Ekipte varsayılan handler’lar gerçekçi ama mümkün olduğunca basit tutulur. Her testte başka JSON shape üretmek, uygulama tipiyle test fixture’ının birbirinden ayrılmasına neden olur. API response tipi değiştiğinde factory veya ortak handler’ı güncelle, sonra özel senaryoların yalnız relevant alanları override etmesine izin ver.

:::sector
Üretim sistemlerinde hata senaryoları yalnızca gerçek servis arızası olduğunda gözlenir; geliştirici testleri ise 401, 404, 429, 500 ve boş yanıtı güvenle üretir. Takım, endpoint’in response sözleşmesini aynı yerde tutup her teste gereken özel senaryoyu ekler. Bu yaklaşım hata UI’ının deploy öncesinde denenmesini sağlar.
:::

## Özet

- `server.use` bir testte özel HTTP davranışı ekler; lifecycle reset’i sızıntıyı önler.
- Boş başarı ile HTTP hatası farklı kullanıcı durumlarıdır.
- Handler’da status ve gövdeyi birlikte gerçekçi kur.
- Gecikme yalnız loading veya yarış sırası önemliyse eklenir.
- Test hem request davranışını hem görünür UI sonucunu ihtiyaç olduğunda doğrular.

**Kendini yokla:** Boş sonuç neden 503 ile aynı değildir?  
*Cevap:* Boş liste başarılı bir yanıttır; servis hata vermemiştir.

**Kendini yokla:** Bir testteki handler override’ı sonraki teste nasıl taşınmaz?  
*Cevap:* Test sonrası `server.resetHandlers()` çalıştırılır.
