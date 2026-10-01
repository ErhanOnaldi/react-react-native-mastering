---
title: "Sonraki adım: web, sunucu veya mobil"
minutes: 16
kind: concept
---

# Sonraki adım: web, sunucu veya mobil

Kitaplık'taki eserleri arıyor ve okuma listeni tarayıcıda saklıyorsun. Basit React bilgini değiştirmeden bu uygulamayı üç yönde büyütebilirsin: kullanıcıların kendi listelerini hesaplarında saklayan bir sunucu kurmak, eser sayfalarını ilk HTML'de göstermek ya da uygulamayı telefona yüklenen yerel bir deneyime taşımak. Önce her seçeneğin çözdüğü ihtiyacı küçük bir örnekte görelim.

## Okuma listesi tarayıcıda mı kalmalı?

Şu an listen `localStorage`'da, yani tarayıcıdaki kalıcı depoda duruyor. Aynı tarayıcıda sonraki ziyarette de görürsün; başka cihazdan açınca ise orada bulunmaz. Listeyi hesaba bağlamak istiyorsan veriyi sunucuda saklaman gerekir.

İlk adımda tarayıcıdan kendi sitendeki bir yola istek gönderdiğini düşün:

```ts
const response = await fetch('/api/reading-list')
```

`/api/reading-list` aynı web adresinin altında olduğu için tarayıcı bunu sayfanla aynı **origin**'e (şema, alan adı ve porttan oluşan kaynak adresine) gönderir. Bu basit istek tarayıcının CORS iznine takılmaz. CORS, başka bir origin'den gelen cevabı sayfa kodunun okuyup okuyamayacağını denetleyen tarayıcı kuralıdır.

Şimdi API ayrı portta çalışıyor olsun: web arayüzü `localhost:5173`, API `localhost:5000`. Tarayıcı açısından port da origin'in parçasıdır; bu iki adres farklıdır. Geliştirmede Vite, `/api` isteklerini API'ye arka planda iletebilir. Bu yönlendirmeye **reverse proxy** denir: tarayıcıya tek adres gösterilir, aradaki sunucu isteği doğru servise aktarır.

```ts title="vite.config.ts"
export default defineConfig({
  server: {
    proxy: {
      '/api': 'http://localhost:5000',
    },
  },
})
```

Bu örnekte tarayıcı yine `localhost:5173/api/reading-list` adresini görür. Vite isteği `localhost:5000`'e taşır; tarayıcı iki ayrı origin arasında doğrudan cevap okumadığı için yerel geliştirmede CORS izni gerekmez. Canlı ortamda da API'yi aynı adresin arkasına yönlendirebilir veya API'de yalnızca uygulamanın adresine izin verebilirsin.

## Tarayıcı isteği neden önce OPTIONS gönderiyor?

Listeye yeni bir kitap eklemek için `POST` ve JSON gövdesi kullanalım. Farklı origin'e yapılan bu tür isteklerde tarayıcı önce sunucuya `OPTIONS` yöntemiyle bir **preflight** (ön kontrol) isteği yollar. Böylece asıl isteği göndermeden önce sunucunun bu origin'e, yönteme ve başlıklara izin verip vermediğini sorar.

```ts
await fetch('https://api.kitaplik.example/reading-list', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ workId: 'OL123' }),
})
```

![Tarayıcı önce izin sorar, sonra asıl isteği gönderir](diagram:cors-preflight)

İstek sırası şöyle ilerler:

| Adım | Kim ne yapar? | Sonuç |
| --- | --- | --- |
| 1 | Tarayıcı `OPTIONS /reading-list` yollar | Sunucu izinleri kontrol eder |
| 2 | API izin verilen origin, `POST` ve `Content-Type` yanıtını verir | Tarayıcı devam edebilir |
| 3 | Tarayıcı JSON gövdeli `POST` isteğini yollar | API kitap kaydını işler |
| 4 | API cevabı izin başlıklarıyla döner | Sayfa kodu cevabı okuyabilir |

Tarayıcı izin alamazsa `POST` adımına geçmez; Console'da CORS hatası görürsün. Bu, API'nin kimlik doğrulama veya veri kontrolünü atladığı anlamına gelmez: CORS tarayıcının cevap okuma iznidir, API güvenliğinin yerine geçmez.

İsteklerin kullanıcı hesabına ait olması için API'nin kim olduğunu anlaması gerekir. Yaygın bir seçenek, girişte verilen `HttpOnly` çerezi kullanmaktır. Tarayıcı çerezi otomatik gönderir; `HttpOnly` olduğu için sayfadaki JavaScript içeriğini okuyamaz. Fakat çerezin otomatik gönderilmesi başka bir riski açar: **CSRF** (Cross-Site Request Forgery), başka bir sitenin kullanıcının açık oturumunu kullanarak istemediği işlem isteği başlatmasıdır. API, çerezli değişiklik isteklerini `SameSite` ayarları ve CSRF token gibi kontrollerle korumalıdır.

:::mistake[CORS hatasında herkese izin açmak]
**Belirti:** `OPTIONS` isteği izin alamaz ve ardından `POST` hiç görünmez; hatayı kapatmak için API'de her origin'e izin vermeyi denersin.  
**Neden:** Tarayıcının yerel geliştirme isteği ayrı porttaki API'ye gidiyordur; canlı ortamda herkese izin vermek ise istenmeyen sitelere de cevapları açabilir.  
**Düzeltme:** Yerelde Vite proxy'sinden geçir; canlıda uygulamanın bilinen adresine izin ver. CORS, kimlik doğrulama ve CSRF korumasının yerine geçmez.
:::

## Sunucuyla konuşan istemci neyi doğrular?

API isteğine ek olarak cevabı da kontrol etmelisin. TypeScript'teki tipler yazarken yardımcı olur, ama ağdan gelen JSON'u çalışma anında doğrulamaz. Kitap ekleme cevabının biçimini Zod ile kontrol edebilirsin:

```ts check
import { z } from 'zod'

const SavedWorkSchema = z.object({
  id: z.string(),
  title: z.string(),
})

export type SavedWork = z.infer<typeof SavedWorkSchema>

export async function addWork(workId: string): Promise<SavedWork> {
  const response = await fetch('/api/reading-list', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ workId }),
  })

  if (!response.ok) {
    throw new Error(`İstek başarısız: HTTP ${response.status}`)
  }

  const raw: unknown = await response.json()
  const result = SavedWorkSchema.safeParse(raw)
  if (!result.success) {
    throw new Error('Sunucu beklenen eser biçimini döndürmedi')
  }

  return result.data
}
```

Önce HTTP cevabının başarılı olup olmadığına bakıyoruz; çünkü `fetch`, 404 veya 500 cevaplarında kendi başına hata fırlatmaz. Sonra JSON'u `unknown` kabul edip Zod ile biçimini kontrol ediyoruz. `safeParse`, veri uygunsa ayrıştırılmış değeri; değilse hata bilgisini döndürür, bu yüzden başarısız cevabı da açıkça ele alabiliyoruz.

API ekibi hangi yolların hangi alanları alıp döndürdüğünü belgeleyebilir. **DTO** (Data Transfer Object), API sınırından taşınan veriyi tanımlayan nesne biçimidir. **OpenAPI**, bu istek ve cevap biçimlerini makine tarafından okunabilir bir şemada tarif eden standarttır. Bu şemadan TypeScript tipleri üretilebilir; yine de çalışma anında gelen JSON'u doğrulamak ayrı bir iştir.

ASP.NET Core (Microsoft'un C# ile sunucu uygulaması kurma çatısı) ile kendi API'ni yazarsan, aynı sorumluluklar orada da karşına çıkar: uygun kökenlere CORS izni, oturum kontrolü, sunucu tarafında veri doğrulama ve açık bir cevap biçimi. Frontend ile backend aynı verinin alan adlarını ve anlamlarını paylaşmalı; OpenAPI bu anlaşmayı görünür kılmaya yardım eder.

## İlk HTML'de eser bilgisi gerektiğinde

Kitaplık'ın eser detay adresinin arama motorlarında görünmesini ve başlık/açıklamanın sayfa açılır açılmaz HTML'de bulunmasını istediğini düşün. Vite ile kurduğun mevcut uygulama genellikle önce JavaScript'i yükler, sonra tarayıcıda API'den veriyi alıp ekranı doldurur. **Next.js**, React ile web uygulaması kuran bir framework'tür; App Router yapısında sunucuda çalışan **Server Component**, HTML üretirken veriyi alabilir.

Kişisel okuma listesi ise hâlâ bu tarayıcının `localStorage`'ında ve ekrandaki form etkileşimli. O bölüm tarayıcıda çalışan bir **Client Component** olmalıdır; örneğin `useState`, olay işleyicisi veya `localStorage` kullanabilir. Sayfayı tek parça seçmek zorunda değilsin: herkese açık eser bilgisi sunucuda, kişisel form istemcide kalabilir.

| Parça | Nerede çalışır? | Neden? |
| --- | --- | --- |
| Eser başlığı ve açıklaması | Server Component | İlk HTML'de gösterilebilir |
| Okuma listesi formu | Client Component | Tarayıcı depolaması ve etkileşim kullanır |

Örneğin tüm sayfayı istemciye taşıyıp her dosyaya `'use client'` eklersen, bu tek başına eser bilgisini sunucuda üretmez. İhtiyaca göre sınırı seç: etkileşim ve tarayıcı API'si gereken küçük bölüm istemcide olsun, uygun herkese açık veri sunucuda üretilebilsin.

## Uygulama mağazaya gidecekse

Web arayüzünü telefonda açmak, mağazadan indirilen yerel uygulamayla aynı şey değildir. Gerçek bir iOS/Android arayüzü istiyorsan **React Native**, React bileşen modelini mobil işletim sisteminin arayüz öğeleriyle kullandırır; **Expo** ise bu uygulamaları geliştirme ve çalıştırma araçlarını sağlar.

Şu becerilerin taşınır: bileşenleri parçalara ayırmak, `props` ve `state` kullanmak, veri biçimini Zod ile tanımlamak, asenkron isteği yönetmek. Web'e özgü `div`, `button`, CSS ve `localStorage` aynen taşınmaz. Yerine örneğin `View`, `Text`, `Pressable` gibi mobil bileşenler ve uygun cihaz depolaması gelir.

Tüm Kitaplık'ı yeniden yazmadan önce tek bir Dune eser ekranıyla deneme yapmak daha çok bilgi verir. O küçük ekranda yerel bileşenleri, ağ bağlantısını ve cihazda saklama kararını görürsün; ardından kapsamı büyütüp büyütmeyeceğine kanıta dayanarak karar verirsin.

## Hangi yol hangi ihtiyaca uyar?

Bu yollar birbirinin yeni sürümü değil; farklı ihtiyaçları çözer. Hesaplar arasında paylaşılan okuma listesi için kendi API'n gerekir. İlk HTML'de görünmesi gereken web içeriği için Next.js ve Server Components'i araştırırsın. Mağazadan kurulup yerel arayüz kullanan uygulama için React Native ve Expo'yu denersin.

React'ten öğrendiklerin kaybolmaz: verinin kime ait olduğunu, nerede saklandığını ve bileşenlerin nasıl ayrıldığını düşünmeye devam edersin. Yeni ortamda değişen şey, veriye veya ekrana hangi yoldan ulaştığındır.

## Özet

- Tarayıcı farklı origin'e istek gönderdiğinde CORS izni gerekir; geliştirme proxy'si tarayıcıya aynı origin'i gösterir.
- `POST` ve JSON gibi isteklerde tarayıcı önce preflight `OPTIONS` isteği atabilir; izin başarılıysa asıl isteğe geçer.
- Kendi API'n kullanıcı verisini saklayabilir; CORS, kimlik doğrulama ve CSRF ayrı kontrollerdir.
- Server Component herkese açık eser bilgisini sunucuda üretebilir; etkileşimli okuma listesi formu Client Component'ta kalabilir.
- React Native ile React becerilerinin bir kısmı taşınır, ama web DOM'u, CSS'i ve `localStorage` aynı biçimde taşınmaz.

**Yeni terimler**

- **Origin:** Şema, alan adı ve porttan oluşan kaynak adresi.
- **CORS:** Tarayıcının başka origin'den gelen cevabı sayfa koduna açma izni.
- **Reverse proxy:** Bir sunucunun gelen isteği arka planda başka bir servise iletmesi.
- **Preflight:** Tarayıcının asıl istekten önce izinleri sormak için gönderdiği `OPTIONS` isteği.
- **CSRF:** Başka bir sitenin açık oturum üzerinden kullanıcı adına işlem başlatma riski.
- **DTO:** API üzerinden taşınan verinin alanlarını belirleyen nesne biçimi.
- **OpenAPI:** API istek ve cevaplarını tanımlayan makinece okunabilir standart.
- **Server/Client Component:** Sırasıyla sunucuda HTML üreten ve tarayıcıda etkileşim sağlayan bileşen türleri.
- **React Native / Expo:** Sırasıyla yerel mobil arayüz için React çatısı ve uygulama geliştirme araçları.

### Kendini yokla

1. **Soru:** JSON gövdeli bir `POST` başka origin'e gittiğinde neden Network panelinde `OPTIONS` görebilirsin?  
   **Cevap:** Tarayıcı asıl isteği göndermeden önce API'nin bu origin'e ve kullanılacak yönteme/başlıklara izin verip vermediğini kontrol eder.
2. **Soru:** Kitaplık'ta eser açıklaması ilk HTML'de olsun, okuma listesi formu `localStorage` kullansın istiyorsun. Hangi kısmı nerede tutarsın?  
   **Cevap:** Eser açıklamasını sunucuda çalışan Server Component'ta üretirim; tarayıcı depolaması ve etkileşim kullanan formu Client Component'ta bırakırım.

:::info[Derinlemesine (isteğe bağlı)]
ASP.NET Core'da CORS politikası `WithOrigins("https://app.kitaplik.com")` ile güvenilen web adresini sınırlar. Çerez gönderen bir fetch çağrısı `credentials: 'include'` ister ve sunucunun da credentials iznini vermesi gerekir; credentials açıkken `AllowAnyOrigin` kullanılamaz. Canlı ortamda bir reverse proxy `/api` yolunu API'ye yönlendirerek web arayüzü ve API'yi aynı origin altında da sunabilir.

Bearer token kullanan isteklerde `Authorization` başlığı preflight'a yol açabilir. Token'ı `localStorage`'da saklamak XSS (sayfada çalıştırılmış zararlı JavaScript) durumunda çalınma riskini artırır; kimlik doğrulama yöntemi ve token saklama yeri birlikte kararlaştırılmalıdır.

ASP.NET Core, `AddOpenApi()` ve `MapOpenApi()` gibi araçlarla OpenAPI şeması yayınlayabilir. Şemadan TypeScript tipi üretmek, çalışma anındaki Zod doğrulamasını ortadan kaldırmaz: derleyici ağdan dönen gerçek JSON'u inceleyemez.
:::
