---
title: "CORS ve Same-Origin Policy"
minutes: 18
kind: concept
---

# CORS ve Same-Origin Policy

:::pain[Problem]
Vite geliştirme sunucun `http://localhost:5173` üzerinde çalışıyor. Backend ekibinin yerelde ayağa kaldırdığı `http://localhost:5000/api/movies` adresine `fetch` ile istek atıyorsun. Postman'de tıkır tıkır çalışan bu istek, React uygulamasında anında kırmızıya boyanıyor. Konsolda korkutucu bir hata beliriyor:  
`Access to fetch at 'http://localhost:5000/api/movies' from origin 'http://localhost:5173' has been blocked by CORS policy: No 'Access-Control-Allow-Origin' header is present on the requested resource.`  
JavaScript tarafında `catch(err)` bloğu ise yalnızca anlamsız bir `TypeError: Failed to fetch` yakalıyor. Postman sorunsuz çalışırken tarayıcı neden veriyi senden gizliyor?
:::

## Tarayıcının güvenlik kalkanı: Same-Origin Policy

Web güvenliğinin temel taşı **Same-Origin Policy** (Aynı Köken Politikası) adı verilen tarayıcı mekanizmasıdır. Bu politika, bir kökenden (origin) yüklenen betiğin başka bir kökene ait verilere keyfi şekilde erişmesini engeller.

Bir **origin (köken)** üç bileşenin birleşimidir:
1. **Protokol (Şema):** `http:` veya `https:`
2. **Alan Adı (Host):** `localhost`, `api.themoviedb.org`, `ornek.com`
3. **Bağlantı Noktası (Port):** `5173`, `5000`, `443` (https için varsayılan), `80` (http için varsayılan)

Bu üç parçadan **herhangi biri farklıysa**, tarayıcı bu iki adresi farklı origin kabul eder:

| Kaynak URL | Hedef URL | Durum | Neden? |
| --- | --- | --- | --- |
| `http://localhost:5173` | `http://localhost:5173/api/search` | **Same-origin** | Protokol, host ve port tamamen aynı |
| `http://localhost:5173` | `http://localhost:5000/api/movies` | **Cross-origin** | Portlar farklı (`5173` vs `5000`) |
| `http://localhost:5173` | `https://localhost:5173/api/movies` | **Cross-origin** | Protokoller farklı (`http` vs `https`) |
| `http://localhost:5173` | `http://127.0.0.1:5173/api/movies` | **Cross-origin** | Host adları metin olarak farklı (`localhost` vs `127.0.0.1`) |

Same-origin policy olmasaydı, zararlı bir web sitesini ziyaret ettiğinde o sitenin arka plandaki JavaScript kodu açık olan banka oturumuna senin adına istek atabilir ve hesap hareketlerini okuyabilirdi.

## CORS nedir, ne değildir?

**CORS** (Cross-Origin Resource Sharing), tarayıcının bu katı same-origin kuralını güvenli biçimde esnetme standardıdır.

CORS hakkında zihnini berraklaştırman gereken ilk gerçek şudur:  
**CORS bir sunucu güvenlik duvarı değildir; tarayıcının uyguladığı bir istemci kısıtıdır.**

Postman, `curl`, mobil uygulamalar veya sunucudan sunucuya (backend-to-backend) yapılan çağrılar CORS kuralına takılmaz; çünkü bu araçların içinde Same-Origin Policy işleten bir tarayıcı motoru yoktur. Sunucu isteği alır, işler ve cevabı döner. Tarayıcı ise cevabın başlıklarına bakar: Eğer sunucu `Access-Control-Allow-Origin` başlığıyla açıkça izin vermemişse, dönen veriyi JavaScript koduna **teslim etmez**.

![CORS preflight karar akışı ve izin başlıkları](diagram:cors-preflight)

## Taşıyıcı zihinsel model: Basit istekler ve Preflight (OPTIONS)

Tarayıcı, sunucuya göndereceği istekleri iki kategoriye ayırır:

### 1. Basit İstekler (Simple Requests)
Tarihsel olarak HTML formlarının (`<form>`) yapabildiği eylemlerdir. Tarayıcı bu istekleri doğrudan gönderir; ön kontrol yapmaz. Bir isteğin basit sayılması için:
- Yöntem yalnızca `GET`, `HEAD` veya `POST` olmalıdır.
- Yalnızca güvenli kabul edilen başlıklar (CORS-safelisted headers) içermelidir: `Accept`, `Accept-Language`, `Content-Language`.
- Eğer `Content-Type` başlığı varsa yalnızca şu üç değerden biri olabilir:
  - `application/x-www-form-urlencoded`
  - `multipart/form-data`
  - `text/plain`

### 2. Preflight Gerektiren İstekler
Modern web uygulamalarının kullandığı neredeyse her istek bu kategoriye girer:
- `Content-Type: application/json` göndermek
- `Authorization: Bearer <token>` başlığı eklemek
- `PUT`, `DELETE` veya `PATCH` gibi durum değiştiren metotlar kullanmak
- Özel başlıklar eklemek (`X-Custom-Header`)

:::model[CORS ve Preflight Akışı]
Preflight gerektiren bir istekte tarayıcı asıl isteği bekletir. Önce sunucuya hafif bir ön kontrol isteği (`OPTIONS`) gönderir:  
1. **Tarayıcı sorar:** "Ben `http://localhost:5173` kökeninden geliyorum (`Origin`), az sonra `POST` yöntemiyle ve `Authorization`, `Content-Type` başlıklarıyla bir istek atacağım (`Access-Control-Request-Headers`). İzin veriyor musun?"  
2. **Sunucu yanıtlar:** "Evet, `http://localhost:5173` kökenine izin veriyorum (`Access-Control-Allow-Origin`), `POST` yöntemine izin veriyorum (`Access-Control-Allow-Methods`), bu başlıklara izin veriyorum (`Access-Control-Allow-Headers`). Bu izni 600 saniye önbelleğe alabilirsin (`Access-Control-Max-Age`)."  
3. **Asıl istek ateşlenir:** Ön kontrol başarılıysa tarayıcı gerçek `POST` isteğini fırlatır. Sunucu izin vermezse asıl istek **hiç gönderilmez** ve konsolda CORS hatası üretilir.
:::

## Zaman çizelgesinde preflight adımları

| Zaman | Aktör | Ağ Eylemi / Paket | HTTP Durumu | Anlamı |
| --- | --- | --- | --- | --- |
| 0 ms | Tarayıcı | `OPTIONS /api/movies` (Preflight) | — | Tarayıcı izin sorgusunu yolladı |
| 40 ms | Sunucu | Cevap: `Access-Control-Allow-Origin: ...` | `204` / `200` | Sunucu izin kurallarını onayladı |
| 45 ms | Tarayıcı | `POST /api/movies` (Asıl İstek) | — | Gerçek veri paketi yola çıktı |
| 90 ms | Sunucu | JSON cevabı | `200 OK` | Veri tarayıcıya ulaştı ve JS'e teslim edildi |

Network sekmesinde aynı adrese art arda iki satır görmenin sebebi budur: İlk satır `OPTIONS` (Preflight), ikinci satır asıl istektir (`POST`, `PUT`, `GET`).

## CORS hatasında JavaScript ne görür?

CORS hatası oluştuğunda tarayıcı güvenliği en üst düzeyde tutar:  
Sunucunun döndürdüğü hata durumunu veya gövdesini JavaScript'in okumasına **asla izin vermez**.

`fetch()` çağrısı genel bir `TypeError: Failed to fetch` hatasıyla reject olur. `error.message` içinde CORS kelimesi dahi geçmez. Hatanın CORS sebebiyle oluştuğunu doğrulayabileceğin tek yer **geliştirici konsoludur (Console sekmesi)**. Bu yüzden kodun içinde `if (error.isCors)` gibi bir mantık kuramazsın; CORS teşhisi konsol loglarından yapılır.

## Çözüm yolları: CORS nasıl aşılır?

CORS sorununu çözmek için üç meşru mimari yaklaşım vardır:

### 1. Çözüm: API sunucusunda CORS politikasını yapılandırmak
Kalıcı ve doğru çözüm, backend servisinin istemci kökenine açıkça izin vermesidir. İleride backend geliştirmede kullanacağın **ASP.NET Core** platformunda bu kural şöyle tanımlanır:

```csharp
// ASP.NET Core: Program.cs içinde CORS politikası tanımlama
var builder = WebApplication.CreateBuilder(args);

builder.Services.AddCors(options =>
{
    options.AddPolicy("FrontendPolicy", policy =>
    {
        policy.WithOrigins("http://localhost:5173") // Vite geliştirme sunucusu
              .AllowAnyHeader()
              .AllowAnyMethod();
    });
});

var app = builder.Build();

app.UseCors("FrontendPolicy"); // CORS middleware'ini devreye al

app.MapGet("/api/movies", () => Results.Ok(new[] { "Matrix", "Inception" }));

app.Run("http://localhost:5000");
```

Backend tarafında `AllowAnyHeader()` ve `AllowAnyMethod()` eklenmediği takdirde `Authorization` başlığı içeren preflight istekleri reddedilir.

### 2. Çözüm: Geliştirme ortamında Vite Proxy kullanmak
Eğer üçüncü parti bir API'ye bağlanıyorsan ya da backend kodunu o an değiştiremiyorsan, Vite'ın yerleşik proxy (vekil) özelliğini kullanabilirsin. İstekleri `/api` gibi göreli bir yola atarsın; Vite dev sunucusu bu isteği yerelde sunucudan sunucuya aktarır:

```ts
// vite.config.ts
import { defineConfig } from 'vite'

export default defineConfig({
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:5000',
        changeOrigin: true,
      },
    },
  },
})
```

Tarayıcı isteği `http://localhost:5173/api/movies` adresine gönderir. Tarayıcı için istek **same-origin**'dir; dolayısıyla CORS denetimi hiç devreye girmez! Vite arkada `http://localhost:5000/api/movies` adresine sunucu düzeyinde istek atar ve sonucu tarayıcıya geri yansıtır.

### 3. Çözüm: Üretim ortamında aynı origin arkasına yerleştirmek (Reverse Proxy)
Canlı yayında (production) en sağlam yaklaşım, frontend statik dosyaları ile API servisini aynı alan adı altına (örneğin Nginx veya Cloudflare arkasında `/` ve `/api`) toplamaktır. Her şey tek bir kökenden sunulduğu için CORS başlıklarına duyulan ihtiyaç ortadan kalkar.

## Kimlik bilgileri ve çerezler (`credentials`)

Bir istekle birlikte oturum çerezi (cookie) göndermek istiyorsan istemcide `credentials: 'include'` seçeneğini belirtirsin:

```ts check
export async function sendFeedbackWithCredentials(message: string): Promise<boolean> {
  const response = await fetch('http://localhost:5000/api/feedback', {
    method: 'POST',
    credentials: 'include', // Çerezleri ve oturum kimliğini isteğe dahil et
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ message }),
  })

  return response.ok
}
```

Bu noktada tarayıcı çok katı bir güvenlik kuralı işletir:  
Eğer istemci `credentials: 'include'` gönderiyorsa, sunucu `Access-Control-Allow-Origin: *` (joker karakter) **kullanamaz**!  
Sunucunun MUTLAKA açıkça `Access-Control-Allow-Origin: http://localhost:5173` ve ek olarak `Access-Control-Allow-Credentials: true` başlıklarını dönmesi şarttır. Aksi halde tarayıcı cevabı anında engeller.

## Sınır durumları ve sık hatalar

:::mistake[Sık hata: CORS hatasını istemci kodunda try/catch ile çözmeye çalışmak]
Belirti → `catch (err)` içine `console.log(err)` yazılıyor; ancak sadece `TypeError: Failed to fetch` görülüyor.  
Neden → Tarayıcı güvenlik gereği CORS engeliyle ilgili hiçbir ayrıntıyı JavaScript'e sızdırmaz.  
Düzeltme → Kodla hatayı yamamaya çalışma; tarayıcının DevTools **Console** sekmesini açıp kırmızı CORS mesajını oku, izin eksikliğini API'de veya proxy'de gider.
:::

:::mistake[Sık hata: Postman'de çalışıyor diye backend'de sorun olmadığını savunmak]
Belirti → Geliştirici "Postman 200 dönüyor, demek ki sorun React tarafında" iddiasında bulunur.  
Neden → Postman bir tarayıcı değildir; Same-Origin Policy kurallarını işletmez. CORS tamamen tarayıcı ortamının getirdiği bir standarttır.  
Düzeltme → Sorunu tarayıcının gönderdiği `Origin` başlığına backend'in yanıt vermemesinde ara.
:::

:::mistake[Sık hata: Credentials kullanırken sunucuda joker (*) origin bırakmak]
Belirti → `credentials: 'include'` ile yapılan isteklerde konsolda `The value of the 'Access-Control-Allow-Origin' header in the response must not be the wildcard '*' when the request's credentials mode is 'include'` hatası belirir.  
Neden → Tarayıcılar çerezli oturumların herkese açık bir API politikasında çalınmasını bu kuralla engeller.  
Düzeltme → API sunucusunda açıkça `WithOrigins("http://localhost:5173")` ve `.AllowCredentials()` yapılandırması yap.
:::

:::sector
Modern mikroservis ve bulut mimarilerinde API'ler genellikle bir API Gateway (ör. Kong, AWS API Gateway, Azure API Management) arkasına yerleştirilir. Her mikroservisin kendi içinde ayrı ayrı CORS kuralı tanımlaması yerine, CORS politikası merkezi olarak Gateway katmanında yönetilir. Geliştirme sürecinde ise Vite proxy'si kullanmak, yerel frontend ile uzak test API'lerini CORS karmaşasına girmeden birbirine bağlamanın en yaygın ve konforlu yoludur.
:::

## Özet

- Same-Origin Policy; protokol, host ve portun birebir aynı olmasını zorunlu kılar. Biri bile farklıysa istek cross-origin'dir.
- CORS bir sunucu kalkanı değil, tarayıcının JavaScript'e uyguladığı bir veri okuma kısıtıdır; Postman ve curl CORS'tan etkilenmez.
- Güvenli listede olmayan metotlar (`PUT`, `DELETE`) veya başlıklar (`Authorization`, `application/json`), asıl istekten önce `OPTIONS` preflight uçuşu tetikler.
- CORS hatasında JavaScript yalnızca genel `TypeError` yakalar; ayrıntılı tanı konsoldan okunur.
- Çözüm yolları: Backend'de CORS izni vermek (ASP.NET Core politikası), geliştirmede Vite proxy kullanmak veya üretimde reverse proxy ile aynı kökene taşımaktır.

**Kendini yokla:** `http://localhost:5173` adresinden `http://localhost:5000` adresine istek atıldığında neden CORS devreye girer?  
*Cevap:* Çünkü port numaraları farklıdır (5173 vs 5000); tarayıcı bunları farklı origin (köken) kabul eder.

**Kendini yokla:** `Authorization: Bearer my-token` başlığı içeren bir `GET` isteğinde tarayıcı doğrudan veriyi çeker mi?  
*Cevap:* Hayır, `Authorization` başlığı güvenli listede olmadığı için tarayıcı asıl `GET` isteğinden önce bir `OPTIONS` preflight isteği göndererek sunucudan izin ister.
