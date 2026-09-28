---
title: "Çerez güvenliği ve CSRF savunması"
minutes: 14
kind: concept
---

# Çerez güvenliği ve CSRF savunması

:::pain[Kullanıcı farkında olmadan değişen izleme listesi]
Kullanıcı film platformunda oturum açmış durumdayken başka bir sekmede kötü niyetli bir foruma giriyor. Forumdaki bir bağlantıya tıkladığında ya da gizli bir form otomatik gönderildiğinde, platformdaki izleme listesinin silindiğini ya da profil parolasının değiştiğini fark ediyor. Tarayıcı oturum çerezlerini bu sahte isteğe kendiliğinden eklemiştir; sunucu isteğin meşru kullanıcıdan geldiğini varsaymıştır.
:::

## Tarayıcı çerezi nasıl çalışır?

Çerezler (cookies), sunucunun HTTP yanıtındaki `Set-Cookie` başlığıyla tarayıcıya emanet ettiği ve tarayıcının sonraki isteklerde ilgili alan adına otomatik olarak geri gönderdiği küçük anahtar-değer çiftleridir.

Kimlik doğrulamada çerez kullanıldığında tarayıcı, oturum belirtecini (session ID ya da şifreli bilet) yerel depoda (`localStorage`) değil, tarayıcının kendi çerez havuzunda saklar. Çerezin güvenliğini ise sunucunun atadığı bayraklar belirler:

1. **`HttpOnly`:** Çerezin JavaScript tarafında `document.cookie` üzerinden okunmasını veya değiştirilmesini engeller. Bu bayrak sayesinde uygulamada bir XSS (siteler arası betik çalıştırma) açığı oluşsa dahi saldırgan kullanıcının oturum çerezini doğrudan çalamaz. Ancak `HttpOnly` bir ağ kısıtlaması değildir; tarayıcı ağ üzerinden giden isteklere çerezi eklemeye devam eder.
2. **`Secure`:** Çerezin yalnızca şifreli HTTPS bağlantıları üzerinden iletilmesini zorunlu kılar; düz metin HTTP üzerinden taşınmasını ve ağ dinleyicileri tarafından ele geçirilmesini önler.
3. **`SameSite`:** Çerezin siteler arası (cross-site) isteklerde tarayıcı tarafından otomatik olarak gönderilip gönderilmeyeceğini düzenler. Üç modu vardır:
   - **`Strict`:** Kullanıcı başka bir sitedeki bağlantıya tıklasa dahi çerez asla gönderilmez. En yüksek güvenliği sağlar ancak dış linkten gelen kullanıcının oturumsuz görünmesine neden olur.
   - **`Lax`:** Modern tarayıcılarda varsayılandır. Siteler arası güvenli navigasyonlarda (örneğin kullanıcı bir linke tıklayıp siteye girdiğinde `GET` ile) çerez iletilir; ancak başka sitelerden tetiklenen durum değiştirici isteklerde (`POST`, `PUT`, `DELETE` veya `<iframe>` içi isteklerde) çerez gönderilmez.
   - **`None`:** Çerez her türlü çapraz site isteğinde gönderilir. Bu modun çalışabilmesi için `Secure` bayrağının tanımlı olması zorunludur.

## Siteler Arası İstek Sahteciliği (CSRF) modeli

CSRF (Cross-Site Request Forgery), saldırganın oturum açmış bir kullanıcının tarayıcısını kullanarak onun yetkisiyle hedef web uygulamasına istenmeyen istekler göndermesini sağlayan bir saldırı türüdür.

Tarayıcılar, bir web sitesine istek yaparken o siteye ait uygun çerezleri otomatik olarak isteğin başlığına iliştirir. Saldırgan bu davranışı suistimal eder:

1. Kurban `https://sinema.example` adresinde oturum açar ve tarayıcısında geçerli bir oturum çerezi bulunur.
2. Kurban oturumunu kapatmadan saldırganın hazırladığı `https://tuzak.example` sayfasına girer.
3. Tuzak sayfadaki bir script, arka planda `https://sinema.example/api/account/delete` adresine bir `POST` isteği fırlatır (veya gizli bir HTML formunu `submit` eder).
4. Kurbanın tarayıcısı, hedef etki alanı `sinema.example` olduğu için kullanıcının oturum çerezini isteğe otomatik ekler.
5. Sunucu çerezi kontrol eder, kullanıcının oturumunu doğrular ve isteği çalıştırır.

### İstek türleri ve saldırı zaman çizelgesi

| Adım | Kullanıcı / Tarayıcı Eylemi | İstek Hedefi | Çerez Durumu | Sonuç |
| --- | --- | --- | --- | --- |
| 1 | Kullanıcı platforma giriş yapar | `sinema.example/login` | Sunucu `Set-Cookie: session=xyz; HttpOnly; SameSite=Lax` döner | Oturum başladı |
| 2 | Kullanıcı harici bir foruma girer | `forum.example/post` | `sinema.example` çerezleri gönderilmez | Farklı origin |
| 3 | Forumdaki gizli form `sinema.example/watchlist/clear` adresine `POST` atar | `sinema.example` | `SameSite=Lax` olduğu için çapraz site `POST` isteğinde çerez **gönderilmez** | İstek yetkisiz kalır (401) |
| 4 | Eğer çerez `SameSite=None` ise | `sinema.example` | Çerez otomatik olarak sunucuya iletilir | CSRF açığı oluşur |

## CSRF savunma katmanları

CSRF zafiyetini önlemek için tek bir mekanizmaya güvenmek yerine çok katmanlı savunma uygulanır:

1. **`SameSite=Lax` veya `Strict` kullanımı:** İlk ve en etkili savunma hattıdır. Modern tarayıcılarda varsayılan `Lax` davranışı birçok basit CSRF formunu durdurur.
2. **Anti-CSRF (Anti-Forgery) Token:** Sunucu her kullanıcı oturumu veya form yüklemesi için tahmin edilemeyen rastgele bir belirteç (token) üretir. Durum değiştiren isteklerde (`POST`, `PUT`, `DELETE`), istemci bu token'ı özel bir HTTP başlığında (örneğin `X-CSRF-TOKEN` veya ASP.NET Core standardında `RequestVerificationToken`) göndermek zorundadır. Tarayıcı başlıkları çerezler gibi otomatik eklemez; JavaScript'in bu başlığı açıkça yazması gerekir. Kötü amaçlı harici siteler Same-Origin Policy nedeniyle bu token'ı okuyamaz ve istek başlığına koyamaz.
3. **HTTP yöntemlerinin ayrımı:** `GET` ve `HEAD` yöntemleri standartlara (RFC 9110) göre "güvenli" (safe/idempotent) kabul edilir ve sunucuda asla veri değişikliği (silme, güncelleme, bakiye düşürme) yapmamalıdır. Veri değiştiren tüm işlemler mutlaka `POST`, `PUT`, `DELETE` gibi gövde taşıyan yöntemlerle yürütülmelidir.

:::model[Same-Origin Policy ve CORS hatırlatması]
7. modülde gördüğün CORS bir sunucu güvenlik duvarı değil, tarayıcının başka origin'e ait cevabı okuma iznidir. Çerezli bir API'ye farklı bir origin'den (örneğin `localhost:5173`'ten `api.sinema.example`'a) istek atarken tarayıcıda `fetch(url, { credentials: 'include' })` ayarı gerekir. Sunucu ise `Access-Control-Allow-Credentials: true` dönmeli ve `Access-Control-Allow-Origin: *` yerine kesin kaynak belirtmelidir (`Access-Control-Allow-Origin: http://localhost:5173`).
:::

## Önce kırık, sonra doğru: Çerezli istek ve CSRF başlığı

Önce çerezleri unutan ya da CSRF başlığını eklemeyen eksik istek kodunu görelim:

```ts title="src/features/auth/unsafeFetch.ts"
// KIRIK: credentials eksik (çerezler gitmez), CSRF koruması yok
export async function updateProfileUnsafe(data: Record<string, unknown>) {
  const response = await fetch('/api/profile', {
    method: 'POST',
    // credentials belirtilmediği için cross-origin API'de oturum çerezi taşınmaz!
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  })
  return response.json()
}
```

Şimdi oturum çerezlerini taşıyan ve durum değiştiren işlemlerde anti-forgery başlığını ekleyen doğru istemci kodunu yazalım:

```ts check title="src/features/auth/sessionApi.ts"
export interface ApiRequestOptions {
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH'
  headers?: Record<string, string>
  body?: unknown
  csrfToken?: string
}

export function createSessionFetchInit(options: ApiRequestOptions = {}): RequestInit {
  const method = options.method ?? 'GET'
  const headers: Record<string, string> = { ...options.headers }

  // Yalnızca veri değiştiren yöntemlerde CSRF başlığını ekle
  const isStateChanging = method !== 'GET'
  if (isStateChanging && options.csrfToken) {
    headers['X-CSRF-TOKEN'] = options.csrfToken
  }

  // Gövde varsa ve içerik tipi verilmemişse JSON olarak belirle
  let bodyContent: BodyInit | undefined
  if (options.body !== undefined) {
    if (!headers['Content-Type']) {
      headers['Content-Type'] = 'application/json'
    }
    bodyContent = JSON.stringify(options.body)
  }

  return {
    method,
    headers,
    credentials: 'include', // Çerezlerin istekte iletilmesini garanti et
    body: bodyContent,
  }
}
```

Bu fonksiyonu kullanarak güvenli profil güncelleme isteği:

```ts title="src/features/auth/updateProfile.ts"
import { createSessionFetchInit } from './sessionApi'

export async function updateProfile(data: { name: string }, csrfToken: string): Promise<boolean> {
  const init = createSessionFetchInit({
    method: 'POST',
    body: data,
    csrfToken,
  })

  const response = await fetch('/api/profile', init)
  return response.ok
}
```

## Bearer Token ile Çerez Oturumu: Ödünleşimler

Kimlik doğrulama mimarisi seçilirken Bearer Token (örneğin localStorage'da tutulan JWT) ile Çerez Oturumu (örneğin HttpOnly çerez) arasında şu temel ödünleşimler tartılır:

1. **XSS karşısında durum:**
   - **Çerez (HttpOnly):** XSS saldırganı çerezi JavaScript ile okuyamaz; token doğrudan çalınamaz. Ancak saldırgan kurbanın tarayıcısında kod çalıştırarak aynı origin üzerinden oturumlu istekler tetikleyebilir.
   - **Bearer Token (localStorage):** XSS saldırganı `localStorage.getItem('token')` çağrısı yaparak token'ı doğrudan çalar ve kendi makinesinden bağımsız olarak kullanabilir.
2. **CSRF karşısında durum:**
   - **Çerez:** Tarayıcı çerezleri otomatik gönderdiği için CSRF savunması (SameSite, anti-forgery token) zorunludur.
   - **Bearer Token:** Tarayıcı `Authorization: Bearer <token>` başlığını kendiliğinden eklemez; JavaScript'in açıkça iliştirmesi gerekir. Bu nedenle Bearer token mimarisi CSRF saldırılarına karşı doğal bir koruma sağlar.
3. **Mobil ve üçüncü taraf entegrasyonu:**
   - Bearer token'lar mobil uygulamalar ve API entegrasyonlarında standarttır. Çerezler ise tarayıcı ortamına özgüdür ve farklı alan adları arasında yapılandırma gerektirir.

## Sık hatalar ve düzeltmeleri

:::mistake[GET isteklerine veri silme veya güncelleme bağlamak]
**Belirti:** Kullanıcı bir sohbet kanalında veya e-postada paylaşılan `https://sinema.example/api/watchlist/delete?id=12` linkine tıkladığında izleme listesi anında siliniyor.  
**Neden:** Sunucu silme işlemini `GET` isteğiyle kabul etmektedir. `SameSite=Lax` dahi olsa dış bağlantıya tıklamayla yapılan `GET` isteklerinde çerezler gönderilir.  
**Düzeltme:** Durum değiştiren eylemleri asla `GET` ile tanımlama; `POST` veya `DELETE` yöntemine geçir ve anti-forgery doğrulaması ekle.
:::

:::mistake[SameSite=None kullanırken Secure bayrağını unutmak]
**Belirti:** Tarayıcı konsolunda `Set-Cookie` uyarısı çıkıyor ve çerez kaydedilmiyor ya da çapraz site isteklerinde iletilmiyor.  
**Neden:** Modern web standartlarına göre `SameSite=None` değeri yalnızca `Secure` bayrağı ile birlikte geçerlidir. Şifresiz HTTP üzerinde bu çerezler reddedilir.  
**Düzeltme:** Sunucuda çerez oluşturulurken `SameSite=None; Secure` ikilisini birlikte tanımla ve yerel geliştirmede HTTPS veya localhost kurallarını gözet.
:::

:::mistake[credentials ayarını atlamak]
**Belirti:** Sunucu `Set-Cookie` döndüğü halde ön yüzün sonraki API çağrıları 401 Unauthorized veriyor.  
**Neden:** Ön yüz ile API farklı port veya alt alan adlarındayken `fetch` varsayılan olarak çerezleri çapraz isteklere iliştirmez.  
**Düzeltme:** İstemci tarafında `fetch(url, { credentials: 'include' })` seçeneğini açıkça belirt.
:::

:::sector[Sektör standardı: ASP.NET Core ve BFF deseni]
Modern kurumsal mimarilerde SPA uygulamalarının doğrudan üçüncü parti token'ları saklaması yerine Backend-For-Frontend (BFF) deseni kullanılır. SPA, yalnızca kendi BFF sunucusuyla `HttpOnly` ve `SameSite=Strict` çerezleriyle haberleşir; BFF ise dış API'lere Bearer token ile istek atar. ASP.NET Core tarafında `services.AddAntiforgery(options => options.HeaderName = "X-CSRF-TOKEN")` ve `[ValidateAntiForgeryToken]` özniteliği durum değiştiren tüm uç noktaların başına standart olarak eklenir.
:::

## Özet

- `HttpOnly` çerezler JavaScript erişimini kapatarak XSS ile doğrudan token hırsızlığını engeller; ancak isteklerde çerezin ağ üzerinden otomatik gönderilmesini durdurmaz.
- `Secure` çerezin yalnızca HTTPS üzerinden taşınmasını şart koşar; `SameSite=Lax` ise çapraz site durum değiştiren isteklerde çerez iletimini kısıtlar.
- CSRF saldırısı, oturumu açık kullanıcının tarayıcısına başka siteden durum değiştiren istek attırarak otomatik çerez iletimini kötüye kullanır.
- CSRF savunmasında `SameSite` politikası, durum değiştiren işlemlerde anti-forgery token (`X-CSRF-TOKEN`) ve `GET` yönteminin yalnızca güvenli okumalara ayrılması birlikte kullanılır.
- Bearer token'lar CSRF'e karşı doğal olarak dirençlidir ancak XSS karşısında token hırsızlığı riski taşır; `HttpOnly` çerezler ise tersine XSS hırsızlığını engellerken CSRF önlemi gerektirir.

### Kendini yokla

1. Bir uygulamanın oturum çerezi `HttpOnly` bayrağına sahipse, sitede çalışan kötü niyetli bir XSS script'i bu çerezi `document.cookie` ile okuyabilir mi?
*Cevap:* Hayır, `HttpOnly` bayrağı tarayıcı seviyesinde JavaScript'in `document.cookie` üzerinden çerez değerini okumasını kesin olarak engeller.

2. Durum değiştiren bir `POST` isteğinde anti-forgery token başlığı neden bir CSRF saldırganı tarafından taklit edilemez?
*Cevap:* Çünkü Same-Origin Policy (SOP) gereği saldırganın harici sitesindeki script, hedef uygulamanın token değerini sunucudan veya sayfadan okuyamaz ve isteğin özel HTTP başlığına yerleştiremez.
