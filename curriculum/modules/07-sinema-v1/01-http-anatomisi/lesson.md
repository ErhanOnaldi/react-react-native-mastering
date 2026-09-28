---
title: "HTTP anatomisi: İstek, cevap ve fetch"
minutes: 17
kind: concept
---

# HTTP anatomisi: İstek, cevap ve fetch

:::pain[Problem]
Kullanıcı profilini çekmek için `fetch('/api/users/42')` yazıyorsun. Sunucu aranan kullanıcıyı bulamayıp `404 Not Found` dönüyor. Kodunun `catch` bloğuna düşeceğini ve ekrana "Kullanıcı bulunamadı" yazacağını varsayıyorsun; fakat `catch` hiç çalışmıyor! Ekran beyaz kalıyor, konsolda `TypeError: Cannot read properties of undefined (reading 'name')` patlıyor. Üstelik hatayı loglamak için ikinci kez `response.json()` çağırdığında bu kez `TypeError: Already read` hatasıyla karşılaşıyorsun.
:::

## İstemci ile sunucu arasındaki sözleşme

Web uygulamaları sunucularla HTTP (Hypertext Transfer Protocol) üzerinden haberleşir. Tarayıcı bir **istek** (request) gönderir; sunucu bu isteği işleyip bir **cevap** (response) döndürür. Bu alışveriş metin tabanlı, durumsuz (stateless) bir sözleşmeye dayanır.

Bir HTTP isteği dört temel parçadan oluşur:
1. **Yöntem (Method):** Yapılmak istenen eylemi bildirir (`GET`, `POST`, `PUT`, `PATCH`, `DELETE`, `OPTIONS`).
2. **URL (Adres):** Kaynağın nerede olduğunu gösterir (`https://api.example.com/v1/articles?tag=react`).
3. **Başlıklar (Headers):** İstekle ilgili meta verileri taşır (`Authorization`, `Content-Type`, `Accept`).
4. **Gövde (Body):** Sunucuya gönderilen veri paketidir (`POST` ve `PUT` gibi isteklerde JSON veya form verisi taşır; `GET` isteklerinde gövde bulunmaz).

Sunucunun verdiği cevap da üç temel parçadan oluşur:
1. **Durum kodu (Status code):** İşlemin sonucunu özetleyen 3 basamaklı sayı (`200`, `404`, `500`).
2. **Cevap başlıkları (Response headers):** Dönen içeriğin türü, boyutu ve önbellek politikası (`Content-Type: application/json`, `Cache-Control`).
3. **Cevap gövdesi (Response body):** İstenen verinin kendisi (JSON metni, HTML, görsel baytları ya da boş içerik).

![HTTP istek ve cevap anatomisi ile fetch davranış modeli](diagram:http-istek-cevap)

## Taşıyıcı zihinsel model: HTTP durum aileleri ve fetch kuralları

HTTP durum kodları rastgele seçilmez; yüzlük ailelere ayrılmıştır. Her ailenin tarayıcı ve uygulama için kesin bir anlamı vardır:

1. **2xx Başarı (Success):** İstek başarıyla karşılandı. En sık görülenler `200 OK` (veri gövdede döner), `201 Created` (yeni kayıt oluşturuldu) ve `204 No Content` (işlem başarılı ama cevap gövdesi **kesinlikle boştur**).
2. **3xx Yönlendirme (Redirection):** Kaynak başka bir adrese taşındı veya önbellek doğrulaması başarılı oldu (`301 Moved Permanently`, `304 Not Modified`).
3. **4xx İstemci Hatası (Client Error):** İstekte bir kusur var. `400 Bad Request` (geçersiz parametre), `401 Unauthorized` (kimlik bilgisi eksik veya token geçersiz), `403 Forbidden` (kimlik biliniyor ama bu kaynağa yetki yok), `404 Not Found` (kaynak yok), `409 Conflict` (çakışma), `429 Too Many Requests` (kota aşıldı).
4. **5xx Sunucu Hatası (Server Error):** İstemcinin isteği doğru olsa bile sunucu tarafında beklenmeyen bir çökme yaşandı (`500 Internal Server Error`, `502 Bad Gateway`, `503 Service Unavailable`).

:::model[HTTP istek ve cevap anatomisi]
Tarayıcının yerel `fetch()` fonksiyonu hakkında en kritik kural şudur:  
**`fetch()` bir HTTP hata durumunda (404, 500, 401) Promise'i ASLA reddetmez (reject etmez)!**  
`fetch` Promise'i yalnızca fiziksel ağ düzeyinde bir kopukluk olduğunda (DNS çözülemedi, internet kablosu çekildi, sunucuya hiç ulaşılamadı, CORS engeline takılındı veya istek `AbortController` ile iptal edildiğinde) reddedilir. Sunucudan dönen her geçerli HTTP cevabı —durumu ister `200` ister `500` olsun— başarılı bir `Promise.resolve(Response)` üretir.
:::

Bu zihinsel model şunu zorunlu kılar: Cevabın gerçekten başarılı olup olmadığını anlamak için `response.ok` kontrolü yapmak **senin sorumluluğundadır**.

- `response.ok`: Durum kodu `200` ile `299` (dahil) arasındaysa `true`, diğer tüm durumlarda `false` değerini alır.
- `response.status`: HTTP durumunun sayısal değerini verir (`200`, `404`, `500`).
- `response.statusText`: Durum kodunun metin karşılığıdır (`"OK"`, `"Not Found"`).

## Zaman çizelgesinde istek ve cevap adımları

Bir kullanıcı arayüzünden tetiklenen `fetch` çağrısının aşamalarını adım adım izleyelim:

| Adım | İşlem Noktası | Oluşan Değer / Olay | Akışın Durumu |
| --- | --- | --- | --- |
| 1 | `fetch(url)` çağrıldı | Tarayıcı soket açar, DNS çözer | Ağ aşaması başladı |
| 2 | Sunucu yanıtladı | Sunucu HTTP başlıklarını ve `404` kodunu yolladı | İlk baytlar ulaştı |
| 3 | `fetch` Promise'i çözüldü | `Response` nesnesi döndü (`status: 404`, `ok: false`) | `catch`'e GİTMEZ, kod devam eder |
| 4 | `response.ok` denetimi | Koşul `false` üretir | Uygulama hata fırlatmalıdır |
| 5 | Gövde okuma | `response.json()` çağrılırsa stream tükenir | Gövde yalnızca bir kez okunabilir |

## Gövdeyi okumak: Stream kuralı ve 204 tuzağı

HTTP cevap gövdesi tarayıcıya bir veri akışı (ReadableStream) olarak gelir. Yerel `Response` nesnesinin sunduğu gövde okuma metotları (`response.json()`, `response.text()`, `response.blob()`) bu akışı baştan sona tüketir.

Bu mekanizmanın iki kesin kuralı vardır:

### Kural 1: Gövde yalnızca BİR KEZ okunabilir
Bir kez `await response.json()` dediğinde, alttaki veri akışı kilitlenir ve `response.bodyUsed` bayrağı `true` olur. Aynı `response` nesnesinde ikinci kez `.json()` veya `.text()` çağırmak doğrudan çalışma zamanında `TypeError: Failed to execute 'json' on 'Response': body stream already read` hatası fırlatır.

### Kural 2: 204 No Content cevabında gövde aranmaz
Bir kaynağı sildiğinde (`DELETE /api/items/5`) sunucular sıklıkla `204 No Content` döner. Durum kodu `204` olduğunda HTTP spesifikasyonu gereği cevapta gövde baytı bulunmaz. Eğer `response.ok` doğru diye hemen `await response.json()` çağırmaya kalkarsan, boş metin JSON olarak ayrıştırılamayacağı için `SyntaxError: Unexpected end of JSON input` hatası alırsın. 204 durumunda doğrudan gövdesiz başarı kabul edilmelidir.

## Önce kırık, sonra doğru örnek

### Kırık yaklaşım: Hataları `catch` ile yakalayacağını sanmak

Aşağıdaki kodda geliştirici, sunucu `404` veya `500` dönerse `catch` bloğunun çalışacağını varsaymıştır:

```ts
// KIRIK ÖRNEK: 404 ve 500 durumlarında catch ÇALIŞMAZ!
async function loadArticleBroken(slug: string) {
  try {
    const response = await fetch(`https://api.example.test/articles/${slug}`)
    // Sunucu 404 dönse bile buraya gelir!
    // response.json() 404 HTML hata sayfasını parse etmeye çalışırken çökebilir
    const data = (await response.json()) as { title: string }
    return data.title
  } catch (error) {
    // Yalnızca internet tamamen koptuğunda buraya düşer
    console.error('Hata:', error)
    return 'Yüklenemedi'
  }
}
```

Bu kodda sunucu `404` döndüğünde API çoğu zaman bir hata nesnesi (`{ message: "Not found" }`) ya da HTML hata sayfası döner. Kod `data.title` alanına erişmeye çalıştığında ekranda `undefined` basılır ya da sayfa çöker.

### Doğru yaklaşım: Durum kontrolü, özel hata ve gövdesiz başarı

Doğru mimaride ağ hatası ile HTTP hatası birbirinden net çizgilerle ayrılır:

```ts check
export class ApiRequestError extends Error {
  constructor(
    public readonly statusCode: number,
    message?: string,
  ) {
    super(message ?? `İstek başarısız oldu: HTTP ${statusCode}`)
    this.name = 'ApiRequestError'
  }
}

interface Article {
  id: string
  title: string
  content: string
}

export async function requestArticle(slug: string): Promise<Article | null> {
  // 1. Ağ seviyesinde istek atılır (DNS veya bağlantı hatasında kendiliğinden reject olur)
  const response = await fetch(`https://api.example.test/articles/${slug}`, {
    headers: {
      Accept: 'application/json',
    },
  })

  // 2. HTTP durum kontrolü: 200–299 dışındaki her durum uygulama hatasıdır
  if (!response.ok) {
    // 4xx ve 5xx cevaplarında durum kodunu taşıyan özel hata fırlatılır
    throw new ApiRequestError(response.status)
  }

  // 3. Gövdesiz başarı kontrolü (ör. 204)
  if (response.status === 204) {
    return null
  }

  // 4. Gövde yalnızca bir kez okunur
  const data = (await response.json()) as Article
  return data
}
```

Bu desende:
- `fetch`'in reddetmediği `404`, `401`, `500` gibi durumlar `if (!response.ok)` bloğunda yakalanır.
- Çağıran katman `error instanceof ApiRequestError` kontrolü yaparak hatanın durum kodunu (`statusCode`) okuyabilir ve kullanıcıya uygun mesaj gösterebilir.
- `204` durumu güvenle ele alınır, gereksiz JSON parse hatası önlenir.

## Tarayıcı Network sekmesinde okumak

Geliştirme yaparken bir isteğin durumunu anlamanın en güvenilir yolu Chrome veya Firefox DevTools'taki **Network** sekmesidir:

1. **Status sütunu:** `200` yeşil, `304` nötr, `4xx` ve `5xx` kırmızı görünür. Kırmızı bir satır gördüğünde ilk bakman gereken yer durum kodudur.
2. **Type sütunu:** `fetch` ya da `xhr` etiketini görürsün.
3. **Headers sekmesi:**
   - *General:* İstek URL'si, metodu ve dönen durum kodunu gösterir.
   - *Response Headers:* Sunucunun yolladığı başlıklar (`content-type: application/json; charset=utf-8`).
   - *Request Headers:* Tarayıcının yolladığı başlıklar (`authorization: Bearer ...`).
4. **Response / Preview sekmesi:** Sunucunun yolladığı ham gövdeyi incelersin. Beklediğin JSON yerine bir HTML sayfası mı geldi? Boş mu? Buradan teşhis edersin.

## Sınır durumları ve sık hatalar

:::mistake[Sık hata: 404 yanıtını catch bloğunda beklemek]
Belirti → API `404` döndüğünde `try/catch` bloğundaki `catch` çalışmıyor, uygulama bir sonraki satırda veri varmış gibi davranıp patlıyor.  
Neden → `fetch` yalnızca ağ arızalarında reject eder; HTTP `404` cevabı geçerli bir HTTP yanıtıdır ve resolve olur.  
Düzeltme → İstekten hemen sonra `if (!response.ok) throw new Error(...)` kontrolünü alışkanlık haline getir.
:::

:::mistake[Sık hata: Gövdeyi hem loglamak hem veriye çevirmek için iki kez okumak]
Belirti → `TypeError: Failed to execute 'json' on 'Response': body stream already read` hatası fırlatılıyor.  
Neden → Hata ayıklamak için önce `console.log(await response.text())`, ardından `const data = await response.json()` çağrıldı. Veri akışı ilk okumada tükendi.  
Düzeltme → Gövdeyi bir değişkene alıp tek seferde işle; gerekirse `response.clone()` kullanarak akışın kopyasını oluştur.
:::

:::mistake[Sık hata: 204 No Content cevabında json() çağırmak]
Belirti → Silme veya güncelleme isteği başarılı olduğu halde `SyntaxError: Unexpected end of JSON input` hatası alınıyor.  
Neden → Sunucu `204` durum koduyla boş gövde döndü; tarayıcı boş metni JSON olarak ayrıştıramadı.  
Düzeltme → `response.status === 204` ise `json()` çağırmadan doğrudan `null` dön veya işlemi tamamla.
:::

:::sector
Gerçek dünya projelerinde ham `fetch` nadiren çıplak haliyle bileşenlerin içine yazılır. Ekipler genellikle `response.ok` kontrolünü, durum koduna göre hata sınıfları üretmeyi ve yetkilendirme başlıklarını merkezi bir istemci (API client) fonksiyonunda toplar. TanStack Query veya RTK gibi modern veri yönetimi kütüphaneleri de sunucudan gelen cevabın `Promise.reject` üretmesini bekler; bu yüzden `!response.ok` durumunda hata fırlatan bir fetch sarmalayıcısı yazmak endüstri standardıdır.
:::

## Özet

- HTTP isteği yöntem, adres, başlıklar ve gövdeden; cevap ise durum kodu, başlıklar ve gövdeden oluşur.
- Durum kodları 2xx (başarı), 3xx (yönlendirme/önbellek), 4xx (istemci hatası) ve 5xx (sunucu hatası) ailelerine ayrılır.
- `fetch()` 4xx ve 5xx gibi başarısız HTTP durumlarında Promise'i reddetmez; `response.ok` kontrolü geliştiricinin görevidir.
- Cevap gövdesi bir veri akışıdır (stream) ve yalnızca bir kez okunabilir (`response.bodyUsed`).
- `204 No Content` cevabı başarılıdır fakat gövdesi yoktur; `response.json()` çağrılmamalıdır.

**Kendini yokla:** Sunucu `500 Internal Server Error` döndüğünde `fetch()` çağrısının `catch` bloğu çalışır mı?  
*Cevap:* Hayır, çalışmaz. Sunucu geçerli bir HTTP yanıtı verdiği için Promise resolve olur; hata `response.ok === false` kontrolüyle yakalanmalıdır.

**Kendini yokla:** `response.status === 204` olan bir yanıtta `await response.json()` çağrılırsa ne olur?  
*Cevap:* `SyntaxError: Unexpected end of JSON input` fırlatılır; çünkü 204 cevabının gövdesi boştur ve boş metin JSON olarak ayrıştırılamaz.
