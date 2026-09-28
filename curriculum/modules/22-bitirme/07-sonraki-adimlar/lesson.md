---
title: "Sonraki adım: web, sunucu veya mobil"
minutes: 15
kind: concept
---

# Sonraki adım: web, sunucu veya mobil

:::pain[Problem]
Kitaplık uygulamasını Vite, React ve TypeScript ile başarıyla tamamladın; arama, detay, yerel depolama ve CI testlerin eksiksiz çalışıyor. Ancak uygulamayı kullanıcılara sunduğun gün yeni talepler yağmaya başlar:

1. Bir kullanıcı: *“Kitap listemi telefonumdan da görmek istiyorum; ama tarayıcı verilerimi temizleyince her şey kayboldu.”*
2. Pazarlama ekibi: *“Google arama motoru kitap detay sayfalarımızı indekslemiyor; ilk HTML'de veri gelmediği için aramalarda çıkmıyoruz.”*
3. Bir yönetici: *“Metroda internet çekmezken açılan, uygulama mağazasından indirilen yerel bir mobil sürüm istiyoruz.”*

Tek bir Vite SPA (Single Page Application) mimarisi bu üç ihtiyacın tamamını aynı anda çözemez. React yolculuğunun bu aşamasında, edindiğin temel bileşen ve veri mimarisini hangi yöne doğru genişleteceğini bilinçli seçmelisin.
:::

Bu ders bir kodlama görevi değil; kariyerinin sonraki adımlarını şekillendirecek bir mimari rehberdir. Öğrendiğin **bileşen hiyerarşisi, state kategorileri, asenkron veri yönetimi, Zod sınır doğrulaması ve test kültürü**, gideceğin her yeni ortamda senin ana pusulan olacaktır.

## ASP.NET Core ile kendi API'n: İstemciden tam teşekküllü backend'e

Kitaplık'ta Open Library gibi kamuya açık ve salt okunur bir API kullandın. Ancak gerçek projelerin büyük çoğunluğunda veriler kurumun kendi veritabanında saklanır, kullanıcılar kimlik doğrulamasıyla giriş yapar ve iş kuralları sunucu tarafında işletilir. Kurumsal dünyada bu arka yüz çoğunlukla **ASP.NET Core (C#)** veya benzeri güçlü backend çatılarıyla inşa edilir.

React frontend'ini kendi ASP.NET Core API'ne bağlarken yönetmen gereken beş kritik sınır vardır:

### 1. CORS politikası ve geliştirme proxy'si

Tarayıcıların en temel güvenlik mekanizması **Same-Origin Policy** (Aynı Köken Politikası)'dır. Frontend uygulaman `http://localhost:5173` adresinde çalışırken, ASP.NET Core API'n `http://localhost:5000` (veya `https://localhost:7001`) portundaysa, tarayıcı bu iki adresi farklı "origin" kabul eder.

![CORS preflight mekanizması ve izin kontrol akışı](diagram:cors-preflight)

Bu sınırı iki farklı aşamada çözersin:

- **Geliştirme ortamında (Vite Proxy):** En temiz yol, Vite dev sunucusunu bir ters vekil (reverse proxy) olarak yapılandırmaktır. Tarayıcı istekleri doğrudan kendi kökenindeki `/api` yoluna atar; Vite arka planda bu istekleri ASP.NET Core portuna iletir. Böylece yerel geliştirmede CORS mekanizması hiç tetiklenmez:

```ts
// vite.config.ts — Geliştirme proxy yapılandırması
export default defineConfig({
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:5000',
        changeOrigin: true,
        secure: false,
      },
    },
  },
})
```

- **Üretim ortamında (ASP.NET Core CORS):** Farklı alan adları (örneğin `app.kitaplik.com` ve `api.kitaplik.com`) söz konusu olduğunda, ASP.NET Core tarafında `Program.cs` içinde açık bir CORS politikası tanımlanmalıdır:

```csharp
// ASP.NET Core Program.cs örneği
builder.Services.AddCors(options => {
    options.AddPolicy("FrontendPolicy", policy => {
        policy.WithOrigins("https://app.kitaplik.com")
              .AllowAnyMethod()
              .AllowAnyHeader()
              .AllowCredentials(); // Çerez veya kimlik başlığı için şarttır
    });
});
```

### 2. Kimlik doğrulama: Çerez (Cookie) mi, Bearer Token mı?

Kullanıcıların okuma listesini sunucuda saklamak için kimlik doğrulaması şarttır. Burada iki temel ödünleşim karşına çıkar:

- **HttpOnly ve SameSite Çerezler (Tavsiye edilen kurumsal yaklaşım):** Kullanıcı oturum açtığında sunucu `Set-Cookie` başlığı ile bir oturum bileti gönderir. `HttpOnly` bayrağı sayesinde JavaScript (ve dolayısıyla XSS saldırıları) bu çerezi asla okuyamaz. İsteklerde `credentials: 'include'` kullanılarak çerez her çağrıda sunucuya otomatik taşınır. Bu modelde sunucu tarafında CSRF (Cross-Site Request Forgery) koruması (antiforgery token) uygulanmalıdır.
- **Bearer Token (JWT):** Sunucu istemciye bir JSON Web Token döner. İstemci her istekte `Authorization: Bearer <token>` başlığı gönderir. Bu başlık özel bir başlık olduğu için tarayıcı asıl istekten önce daima bir **CORS preflight (OPTIONS)** isteği fırlatır. Bearer token'ları asla `localStorage`'da saklanmamalıdır (XSS açığında doğrudan çalınır); bellekte (state içinde) tutulmalı ve refresh token ile yenilenmelidir.

### 3. OpenAPI ve uçtan uca tipli istemci mimarisi

ASP.NET Core API'leri uç noktalarını bir **OpenAPI** şeması olarak yayınlayabilir. .NET 9 ve sonrasındaki şablonlarda bu iş yerleşik `Microsoft.AspNetCore.OpenApi` paketiyle yapılır: `builder.Services.AddOpenApi()` ve `app.MapOpenApi()` ile şema varsayılan olarak `/openapi/v1.json` adresinde yayınlanır. (Eski projelerde Swashbuckle ile `/swagger/v1/swagger.json` adresini görebilirsin; Swagger UI gibi arayüzler bu şemanın üstüne eklenen ayrı araçlardır.)

Modern frontend mimarisinde backend modellerini TypeScript'te elle tekrar yazmak büyük bir hata kaynağıdır. `openapi-typescript` gibi araçlar kullanarak backend'in C# DTO sınıflarından doğrudan yüzde yüz uyumlu TypeScript tipleri üretebilirsin:

```bash
# ASP.NET Core şemasından anında TypeScript tipleri üretmek
npx openapi-typescript http://localhost:5000/openapi/v1.json -o src/shared/api/generated.ts
```

### 4. Zod ile sınır doğrulamasının devamı

Üretilen TypeScript tipleri derleme anında sana rehberlik eder; ancak çalışma anında ağdan gelen JSON verisini doğrulayamaz. Backend ekibi bir alanı `null` yapabilir veya yeni bir enum değeri ekleyebilir. Bu yüzden 15. ve 22. modüllerde öğrendiğin **Zod sınır doğrulaması**, kendi API'n ile konuşurken de ilk savunma hattın olmaya devam eder.

## İstek yaşam döngüsünü adım adım izleyelim

Frontend'den ASP.NET Core backend'ine atılan güvenli bir kitap ekleme isteğinin yaşam döngüsünü inceleyelim:

| Adım | Katman | Gerçekleşen olay | Güvenlik / Kontrol |
| --- | --- | --- | --- |
| 1 | React UI | Kullanıcı "Listeye ekle" butonuna tıklar | React Hook Form ve Zod istemci doğrulaması |
| 2 | Vite / İstemci | `fetch('/api/books', { method: 'POST', credentials: 'include' })` | Gövde JSON formatına çevrilir |
| 3 | Ağ / Preflight | Özel başlık varsa tarayıcı `OPTIONS /api/books` atar | ASP.NET Core CORS politikası kontrolü |
| 4 | ASP.NET Core | İstek Controller'a ulaşır (`[Authorize]`) | Çerez/Token doğrulanır, kullanıcı kimliği çözülür |
| 5 | Backend | İş mantığı ve veritabanı (EF Core) kaydı çalışır | Sunucu tarafı FluentValidation / model kontrolü |
| 6 | Yanıt | Sunucu `201 Created` ve oluşturulan nesneyi döner | HTTP durum kodu ve JSON başlığı |
| 7 | Frontend Sınırı | `response.json()` alınır ve Zod şemasından geçirilir | Gelen cevabın beklenen tiplere uygunluğu kanıtlanır |
| 8 | Query Cache | `queryClient.invalidateQueries({ queryKey: ['books'] })` | Önbellek tazelenir, arayüz güncellenir |

## Kod örnekleri: Tipli API istemcisi ve sınır savunması

### Kırık örnek: Tipleri varsayan, hatayı yutan güvensiz çağrı

```ts
// TEHLİKE: Hata yönetimi yok, tipler doğrulanmamış
export async function fetchBrokenUserProfile() {
  const token = localStorage.getItem('token') // GÜVENLİK AÇIĞI: XSS'e açık depolama!

  const res = await fetch('http://localhost:5000/api/user/profile', {
    headers: { Authorization: `Bearer ${token}` },
  })

  // HATA: res.ok kontrolü yapılmamış; 401 veya 500 dönerse res.json() beklenmeyen veri döner
  const data = await res.json()
  return data // Tip unknown değil, any olarak sisteme sızar!
}
```

### Doğru örnek: Zod kalkanlı ve tipli API istemcisi

```ts check
import { z } from 'zod'

// 1. API yanıtının Zod şeması
export const UserBookItemSchema = z.object({
  id: z.string(),
  title: z.string(),
  status: z.enum(['want', 'reading', 'read']),
  rating: z.number().int().min(1).max(5).nullish(),
})

export type UserBookItem = z.infer<typeof UserBookItemSchema>

// 2. Güvenli API istemci fonksiyonu
export async function addCustomBook(payload: {
  title: string
  status: 'want' | 'reading' | 'read'
  rating?: number | null
}): Promise<UserBookItem> {
  const response = await fetch('/api/user-books', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include', // HttpOnly çerezi otomatik taşır
    body: JSON.stringify(payload),
  })

  if (!response.ok) {
    throw new Error(`İstek başarısız oldu: HTTP ${response.status}`)
  }

  const rawJson: unknown = await response.json()

  // Sınır doğrulaması: Gelen verinin şemaya uygunluğu kesinleştirilir
  const parsed = UserBookItemSchema.safeParse(rawJson)
  if (!parsed.success) {
    throw new Error('Sunucudan gelen veri beklenen formata uymuyor')
  }

  return parsed.data
}
```

## İleride: Next.js ve Server Components dünyası

Vite ile kurduğun Kitaplık uygulamasında tarayıcı önce boş bir `index.html` ve JS paketini indirir; ardından API'ye istek atıp arayüzü doldurur (İstemci Taraflı Render - CSR).

Eğer arama motoru görünürlüğü (SEO), ilk açılış hızı veya sunucuya doğrudan erişim kritik bir gereksinime dönüşürse, ilerleyen projelerinde **Next.js App Router** ve **React Server Components (RSC)** mimarisine geçiş yapabilirsin.

- **Server Component (Varsayılan):** Sunucuda (veya derleme anında) çalışır. Tarayıcıya JavaScript göndermez; doğrudan HTML akışı üretir. Veritabanına veya backend servislerine sıfır ağ gecikmesiyle doğrudan bağlanabilir.
- **Client Component (`'use client'`):** Etkileşimli butonlar, form girdileri, `useState`, `useEffect` veya tarayıcı API'leri (`localStorage`) kullanması gereken bileşenler bu sınırın arkasında yer alır.
- **İki dünyanın dengesi:** Eserin başlığı, kapak görseli ve açıklaması sunucuda render edilip anında HTML olarak gönderilirken; kullanıcının puan verdiği veya not yazdığı okuma listesi formu bir Client Component olarak istemcide çalışır.

## Mobilde yerel deneyim: React Native ve Expo

Kullanıcının cebinde, internet olmadan da çalışan gerçek bir mobil deneyim gerektiğinde adresin **React Native** ve **Expo**'dur.

- **Neler aynı kalır?** React bileşen modeli, props, state, custom hook'lar, TanStack Query önbelleklemesi, Zod şemaları ve mimari test disiplini tamamen aynıdır.
- **Neler değişir?** Tarayıcı DOM'u (`div`, `p`, `button`, CSS) yoktur. Bunun yerine mobil işletim sisteminin yerel arayüz öğeleri (`View`, `Text`, `Pressable`, `FlatList`) kullanılır. `localStorage` yerine cihazın yerel depolama mekanizmaları (`AsyncStorage` veya `expo-sqlite`) tercih edilir.

## Sonraki öğrenme yol haritan

| Hedef | İhtiyaç anı | Taşıyacağın temel React becerisi |
| --- | --- | --- |
| **Kendi API'n (ASP.NET Core)** | Verileri veritabanında saklama, oturum açma, çoklu kullanıcı | Zod sınır doğrulaması, fetch anatomisi, CORS ve proxy bilgisi |
| **Next.js & Server Components** | Arama motoru optimizasyonu (SEO), ilk sayfa yükleme hızı | State kategorileri, sunucu ve istemci sorumluluk ayrımı |
| **React Native (Expo)** | Mağazadan indirilen iOS/Android yerel mobil uygulamalar | Hook'lar, veri önbellekleme, türetilmiş state, test stratejisi |

Hangi yöne gidersen git, unutma: teknoloji isimleri değişir, ancak temiz mimari, tek doğruluk kaynağı, sağlam sınır doğrulaması ve güven veren test disiplini kalıcıdır.

## Sık karşılaşılan hatalar

:::mistake[Geliştirme sırasında CORS hatası alınca panikleyip API'de AllowAnyOrigin açmak]
**Belirti:** Konsolda `Access to fetch at 'http://localhost:5000' blocked by CORS policy` hatası görünce backend'de rastgele tüm kökenlere yetki vermek.  
**Neden:** Farklı portlar arası istek Same-Origin Policy gereği engellenmiştir; ancak üretimde herkese açık köken açmak güvenlik açığı yaratır.  
**Düzeltme:** Yerel geliştirmede Vite'ın `server.proxy` özelliğini kullanarak istekleri aynı kökenden geçir; backend CORS'unu yalnızca güvenilir üretim adreslerine sınırla.
:::

:::mistake[Server Component içinde useState veya window çağırmak]
**Belirti:** Next.js Server Component'ında kod derlenirken `useState is not a function` veya `window is not defined` hatası patlaması.  
**Neden:** Server Component sunucuda Node.js ortamında çalışır; tarayıcı penceresine veya kullanıcı etkileşim kancalarına sahip değildir.  
**Düzeltme:** Etkileşimli kodu dosyanın başına `'use client'` direktifi ekleyerek Client Component sınırına taşı.
:::

:::sector[Sektörde Full-Stack ve Poliglot Ekipler]
Büyük kurumsal şirketlerde frontend ve backend ekipleri sıklıkla ayrılır: backend ASP.NET Core veya Java/Go ile yazılırken frontend React ile geliştirilir. Bu ekipler arasındaki en büyük sürtünme "API kontratı" üzerinden çıkar. OpenAPI şemasından tipli istemci üreten ve sınırda Zod ile doğrulama yapan bir React mühendisi, backend değişikliklerinde sistemi koruyan en güvenilir takım oyuncusudur.
:::

## Özet

- Kendi backend'inle konuşurken yerel geliştirmede Vite proxy'si, üretimde ise katı CORS politikası uygulanır.
- Kimlik doğrulamada HttpOnly çerezler XSS saldırılarına karşı en yüksek güvenliği sağlar; Bearer token'lar ise preflight (OPTIONS) mekanizmasını tetikler.
- OpenAPI/Swagger şemaları sayesinde C# backend modellerinden otomatik tipli TypeScript istemcileri üretilebilir.
- Zod sınır doğrulaması, kendi sunucundan gelen yanıtlarda da beklenmedik kırılmaları önleyen ana kalkandır.
- SEO ve ilk render performansı için Next.js & RSC; yerel mobil deneyim için React Native & Expo aynı React zihniyetiyle kullanılır.

### Kendini yokla

1. **Soru:** Vite geliştirme sunucusunda `server.proxy` kullanmak neden CORS hatalarını ortadan kaldırır?  
   **Cevap:** Çünkü tarayıcı isteği `http://localhost:5173/api` adresine gönderir. İstek yapılan köken ile sayfanın kökeni aynı olduğu için tarayıcı CORS kontrolü uygulamaz. Sunucudan sunucuya (Vite Node sürecinden ASP.NET Core sürecine) yapılan arka plan yönlendirmesi ise Same-Origin kısıtlamasına tabi değildir.
2. **Soru:** OpenAPI şemasından üretilen TypeScript tipleri varken neden hâlâ Zod şemasıyla doğrulama yapmalıyız?  
   **Cevap:** Çünkü TypeScript tipleri derleme anında vardır ve JavaScript'e dönüştüğünde silinir. Çalışma zamanında backend beklenmeyen bir `null` gönderirse veya ağda bir ara katman yanıtı bozarsa, TypeScript bunu engelleyemez. Zod, çalışma zamanında veriyi denetleyerek uygulamanın çökmesini önler.
