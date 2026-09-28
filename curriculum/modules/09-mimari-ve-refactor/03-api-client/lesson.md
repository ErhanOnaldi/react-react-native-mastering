---
title: "HTTP işini tek kapıda topla"
minutes: 18
kind: concept
---

# HTTP işini tek kapıda topla

:::pain[Problem]
Sinema'nın detay ekranı Bearer başlığını ekliyor ama arama ekranı unutuyor. Detay 200 dönerken arama 401 alıyor. Dört sayfada farklı hata metinleri var; TMDB adresi veya dil parametresi değiştiğinde hepsini ayrı ayrı bulup güncellemen gerekiyor.
:::

## Ortak HTTP kuralı ile endpoint anlamını ayır

Bir API client, her istekte tekrarlanan protokol kararlarını tek yerde toplar: kök adres, yetkilendirme başlığı, ortak query parametreleri, cevap gövdesini okuma ve HTTP hatasını uygulamanın anlayacağı hataya çevirme. Feature API ise “hangi kaynak isteniyor ve hangi parametre ne anlama geliyor?” sorularını yanıtlar. Sayfa yalnız kullanıcı akışını birleştirir.

![Sayfadan feature API ve ortak HTTP client üzerinden fetch'e giden çağrı](diagrams/api-client-akisi.svg "Endpoint anlamı ile HTTP protokolü ayrı katmandadır.")

Kesin kurallar:

1. **Sayfa UI ve gezinme sınırıdır.** Sayfa arama metnini URL'den alabilir, loading/error/sonuç görünümünü düzenler ve feature fonksiyonunu çağırır. Token başlığını, API kök adresini veya JSON hata biçimini bilmez.
2. **Feature API kaynak anlamını taşır.** `getWeeklyForecast(city)` gibi bir fonksiyon endpoint'i ve alan parametrelerini bilir. O, “hava durumu” dilini HTTP client'ın beklediği yol/parametreye çevirir.
3. **Ortak client protokol kuralını taşır.** Kök adres, Bearer başlığı ve `Accept` gibi her endpoint'te aynı olan parçalar burada kurulur. Client bir film, tür veya arama kelimesinin ürün içindeki anlamına karar vermez.
4. **`fetch` cevabının HTTP başarısını kendin kontrol et.** `fetch` ağ/bağlantı hatasında reject olabilir; 404 veya 500 gibi HTTP cevaplarında ise Promise resolve olur. `response.ok` false ise hata yoluna gir.
5. **HTTP hatasını ve ağ hatasını karıştırma.** HTTP cevabında status kodu ve belki gövde vardır. Ağ hatasında cevap/status olmayabilir. Hata sınıfı HTTP ayrıntılarını koruyabilir; UI ise kullanıcıya uygun mesajı seçer.
6. **Bir generics tipi JSON'u runtime'da doğrulamaz.** `get<Forecast>()` TypeScript'e bir beklenti söyler; gelen JSON'un gerçekten `Forecast` olduğunu garanti etmez. Dış veriyi güvenli tipe çevirmek için ayrıca runtime validation gerekir.
7. **Bir response body'si tek kullanımlıktır.** `response.json()` gövdeyi okur. Hata yolunda gövdeyi hata ayrıntısı için okuduysan aynı response'u başarı yolunda tekrar okuyamazsın; akışı tek karar noktasında kur.

Örnekte ortak client ve feature fonksiyonu şöyle ayrılır. Burada `Forecast` uygulamanın bildiği veri biçimidir; aşağıdaki generic, sunucunun bu biçime uyacağını yalnızca TypeScript'e bildirir:

```ts check
type Forecast = { city: string; temperature: number }

class HttpFailure extends Error {
  constructor(public status: number, message: string) {
    super(message)
    this.name = 'HttpFailure'
  }
}

function createWeatherGateway(token: string) {
  return {
    async get<T>(path: string): Promise<T> {
      const response = await fetch(`https://weather.example.test/v1${path}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      if (!response.ok) {
        throw new HttpFailure(response.status, `HTTP ${response.status}`)
      }
      return (await response.json()) as T
    },
  }
}

const weatherGateway = createWeatherGateway('local-token')

export function getForecast(city: string): Promise<Forecast> {
  return weatherGateway.get<Forecast>(`/forecast?city=${encodeURIComponent(city)}`)
}
```

Gerçek uygulamada query değerlerini string birleştirmek yerine `URL` ve `URLSearchParams` ile eklemek daha güvenlidir: boşluk, `&` veya Türkçe harfler yeni parametre sanılmamalı. Base URL'yi sabit tutup path'i ekle; query anahtarı ve değerini URL API'sine bırak. Yetkilendirme bilgisini query string'e koyma: URL log, geçmiş ve analiz kayıtlarına taşınabilir; hassas token başlıkta olmalıdır.

## 404 cevabını sırayla izle

Bir film kimliği olmayan istek için akışın zaman çizelgesi şöyledir:

| Adım | Kod / olay | Sonuç |
| --- | --- | --- |
| 1 | Sayfa `getDetails(id)` çağırır | Ürün anlamı sayfada endpoint metni olarak dağılmaz |
| 2 | Feature API `GET /movie/:id` seçer | Film endpoint'i ve endpoint'e özel query belli olur |
| 3 | Ortak client URL ve Authorization kurar | Ortak dil/token her istekte aynı uygulanır |
| 4 | `fetch` yanıtı `404` ile resolve olur | Promise reject olmadı; bir HTTP cevabı geldi |
| 5 | Client `response.ok === false` görür | Gövdeyi gerekirse bir kez okur, status'u hata nesnesine taşır |
| 6 | Sayfa hatayı yakalar | UI `Film bulunamadı` gibi doğru kullanıcı metnini seçer |

Bu ayrımın bakım faydası, yalnız satır sayısını azaltmak değildir. Bearer başlığının yanlış olması client'ta düzeltilir; TMDB'nin film endpoint'i değişirse feature API güncellenir; hata mesajının ürün tasarımı değişirse sayfa etkilenir. Bir değişiklik tek sahibi etkiler.

HTTP client'a neyin konacağını seçerken her satıra “bütün endpoint'lerde aynı mı?” diye bak. Authorization başlığı, ortak language parametresi ve hata gövdesinden status çıkarımı tekrar eden protokol politikalarıdır. append_to_response=credits,videos ise yalnız film detayı için anlamlıdır; client'ın içine koyarsan tür listesi veya trend isteğine de taşınabilir. Feature API, endpoint'e özel parametreyi client'a verir.

Ters yönde de aşırı soyutlama olabilir. Her endpoint için ayrı wrapper yalnızca aynı generic get çağrısını yeni isimle sarıyorsa bakım yükü artar; ama getMovieDetails(id) gibi iş alanına ait ad, sayfanın film kimliğini URL path'ine elle çevirmesini önleyebilir. Karar dosya sayısına göre değil, endpoint'in anlamının nerede anlaşılır olduğuna göre verilir. Ağ politikası değişince kaç feature dosyasına dokunacağını tahmin et.

İstek hatasını kullanıcı mesajına birebir taşımak da her zaman doğru değildir. Server'ın HTML hata sayfası JSON olmayabilir; hata body'sinde iç operasyon bilgisi bulunabilir. Client teknik status'u ve güvenli mesajı korur; sayfa kullanıcıya “Detay yüklenemedi” der ve gerekiyorsa retry sunar. Ayrıntılı teşhis logları kullanıcı arayüzünden farklı bir kanaldır. Bu ayrım, ortak client'ın ürün metinleriyle şişmesini de engeller.

## Kırık ve düzeltilmiş HTTP akışı

Bu kod, her fetch hatasında bir exception beklendiği için 404 durumunu sessizce başarı JSON'u gibi döndürebilir:

```ts
async function loadReport(path: string) {
  try {
    const response = await fetch(path)
    return await response.json()
  } catch {
    return { message: 'Rapor alınamadı' }
  }
}
```

Hata yalnız ağ bağlantısında yakalanır; sunucudan gelen 404 bu `catch`'e girmez. HTTP cevabı için status'u açıkça kontrol eden sürüm:

```ts check
type Report = { title: string }

class ResponseFailure extends Error {
  constructor(public status: number, message: string) {
    super(message)
    this.name = 'ResponseFailure'
  }
}

export async function loadReport(path: string): Promise<Report> {
  const response = await fetch(path)
  if (!response.ok) {
    let message = `İstek başarısız (${response.status})`
    try {
      const body = (await response.json()) as { message?: string }
      if (body.message) message = body.message
    } catch {
      // Bazı hata cevaplarının JSON gövdesi olmayabilir.
    }
    throw new ResponseFailure(response.status, message)
  }
  return (await response.json()) as Report
}
```

Hata cevabının gövdesi boş, geçersiz JSON veya beklenmeyen shape olabilir. Bu yüzden hata ayrıntısını okumak için dar bir `try/catch` kullanılır ve anlamlı varsayılan korunur. Başarılı cevapta `response.json()` bir kez çağrılır. `204 No Content` gibi gövdesiz başarı endpoint'lerinde JSON okumaya çalışma; o endpoint'in sözleşmesine göre `void`/boş başarı yolu gerekir.

TypeScript tarafında `as Report` kontrol değildir. Bu cast sadece runtime'da olmayacak bir tip bilgisini ekler. Bir API client'ta `get<T>` kullanılabilir, ama güven sınırı network'tür. JSON'u `unknown` kabul edip Zod gibi validator'dan geçirmek ayrı bir katman; burada en azından iddia ile doğrulama arasındaki farkı bil.

## Sınır durumları ve sık hatalar

:::mistake[Belirti: 404 ekranında catch'e hiç düşmüyor]
**Belirti →** Olmayan film için beklenen hata görünmüyor, kod `undefined` alanla devam ediyor. **Neden →** `fetch` HTTP 404'te resolve oldu. **Düzeltme →** JSON'u başarı tipi saymadan önce `response.ok` değerini kontrol et ve status'u hata olarak taşı.
:::

:::mistake[Belirti: URL'deki sorgu `Dövüş & suç` olarak parçalanıyor]
**Belirti →** Arama isteğinde `query` kesiliyor veya ekstra parametre oluşuyor. **Neden →** Metin query string'e elle birleştirilmiş. **Düzeltme →** `URLSearchParams.set` ile string değerini ekle; URL API'si encoding yapsın.
:::

:::mistake[Belirti: hata metnini okuduktan sonra success JSON boşa düşüyor]
**Belirti →** `body already read` benzeri hata ya da boş sonuç görüyorsun. **Neden →** Aynı response body birden fazla kez okunmuş. **Düzeltme →** Status dalında yalnızca o dala ait tek okuma yap; gerekirse `response.clone()` kararını özel ihtiyaca göre ver.
:::

:::mistake[Belirti: API cevabı yanlışsa TypeScript hiç ses çıkarmıyor]
**Belirti →** `forecast.temperature` undefined ama kod derleniyor. **Neden →** `get<Forecast>` dış JSON'u çalışma anında doğrulamadı. **Düzeltme →** Sınırda `unknown` veriyi runtime şemasıyla doğrula ve hata yolunu görünür kıl.
:::

:::mistake[Belirti: timeout mesajında HTTP status bekleniyor]
**Belirti →** Ağ kopunca `status` değeri anlamsız/boş. **Neden →** Bağlantı hatasında HTTP response oluşmadı. **Düzeltme →** Ağ hatası ile status taşıyan HTTP hatasını ayır; kullanıcıya ikisi için anlaşılır ama uygun mesaj ver.
:::

:::sector
Ekipler ortak client'ta kimlik doğrulama, izleme başlığı, timeout ve hata normalizasyonu gibi protokol politikalarını sabitler. Feature API'nin görevi bu altyapıyı tekrar etmek değil, endpoint sözleşmesini iş alanının adlarıyla sunmaktır. İstemciye derleme sırasında verilen Vite değişkenleri bundle içine girebilir; gerçek üretim sırrı gerekiyorsa çağrıyı backend/BFF sınırına taşı.
:::

## Özet

- Sayfa akışı, feature API endpoint anlamını, ortak client HTTP politikasını taşır.
- `fetch` 4xx/5xx'lerde resolve olur; `response.ok` ile açıkça dallan.
- Hata gövdesi güvenilmez olabilir; status'u ve varsayılan mesajı koru.
- `URLSearchParams` değerleri güvenle kodlar; token URL'de bulunmaz.
- Generic tip network JSON'unu doğrulamaz; runtime validation ayrı iştir.

**Kendini yokla:** `fetch` 500 cevabı aldığında Promise neden `catch`'e girmeyebilir?  
*Cevap:* 500 bir HTTP cevabıdır; `fetch` cevap nesnesiyle resolve olur. `response.ok` false kontrol edilmelidir.

**Kendini yokla:** `get<User>()` sunucunun doğru `User` JSON'u gönderdiğini kanıtlar mı?  
*Cevap:* Hayır. Bu yalnız derleme zamanı iddiasıdır; runtime doğrulaması gerekir.
