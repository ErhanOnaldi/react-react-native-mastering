---
title: "Statik SPA’yı yayına alma"
minutes: 14
kind: concept
---

# Statik SPA’yı yayına alma

Sinema’da bir film kartına tıklayınca `/movie/550` açılıyor. Adresi yeni sekmeye yapıştırınca ne olur? Tarayıcı bu kez uygulamadaki bir düğmeye tıklamaz; doğrudan hosttan bu yolu ister. **Host**, yayımladığın dosyaları tarayıcıya veren sunucudur. Bu ilk istekle başlayalım.

## React’ten önce host yanıt verir

Bir **SPA** (single-page application), sayfaları çoğunlukla tek bir HTML belgesi ve tarayıcıda çalışan JavaScript ile gösterir. React Router bu JavaScript çalıştıktan sonra devreye girer. Şu iz sırasına bak:

| Adım | Tarayıcı ne yapar? | Kim yanıt verir? |
| --- | --- | --- |
| 1 | `/movie/550` için HTTP isteği yollar | Host |
| 2 | Host dosyaları arasında bu yola karşılık gelen dosya arar | Host |
| 3 | Host `index.html` belgesini başarıyla verir | Host |
| 4 | Tarayıcı JavaScript’i indirir ve çalıştırır | Tarayıcı |
| 5 | Router URL’deki `550` değerini okuyup film sayfasını seçer | React uygulaması |

İlk örnek olarak yalnızca URL’nin ne zaman okunduğunu düşün. Uygulama içinde bir bağlantıya tıklarken HTML zaten yüklüdür; router yeni URL’yi hemen işler. Adresi doğrudan açarken ise router henüz çalışmıyordur. Bu yüzden aynı URL, uygulama içinde çalışıp yenilemede 404 verebilir.

Bu durumun çözüm adı **SPA fallback**’tir: host, gerçek dosya bulamadığı bir uygulama yolunda `index.html` belgesini döndürür. Adres çubuğu `/movie/550` olarak kalır; host yalnızca isteğin yanıt gövdesi için HTML’i seçer. Böylece React yüklenir ve URL’yi kendi router’ına bırakabilir.

![Build çıktısının host üzerinden tarayıcıya gitmesi ve derin URL için HTML fallback](diagram:build-ve-yayin "Host, hash’li dosyaları ve derin URL’yi farklı kurallarla sunar.")

## Fallback’i küçük bir kuralla ekle

Örneğin Netlify, yayın klasöründeki `_redirects` dosyasından yönlendirme kurallarını okur. `/*` bütün yolları eşleştirir; sondaki `200`, tarayıcıya yönlendirme değil başarılı yanıt verilmesini söyler:

```text title="public/_redirects"
/*  /index.html  200
```

Bu ikinci örnek, ilk izdeki eksik adımı tamamlar. `/movie/550` için ayrı bir fiziksel dosya bulunmadığında host `index.html` verir; JavaScript yüklenince router filmi seçer. Fallback kuralı bütün isteklere körlemesine uygulanırsa bir JavaScript dosyası isteği de HTML alabilir. Bu nedenle host önce gerçekten var olan dosyaları sunmalı; fallback uygulama yolları için kalmalıdır.

## HTML ile JavaScript farklı hızda değişir

Yayın sırasında HTML belgesi ve JavaScript dosyasının görevleri farklıdır. HTML, tarayıcıya hangi JavaScript dosyasını indireceğini söyler. Derleme aracı içeriği değişen dosyanın adına bir **hash** (içerikten üretilen kısa kimlik) ekleyebilir: örneğin `app-a1.js` yeni sürümde `app-b2.js` olur. Böylece yeni dosyanın adresi de değişir.

**HTTP cache**, tarayıcının daha önce aldığı yanıtı bir süre saklayıp tekrar kullanmasını sağlar. HTML eski kalırsa yeni dosya adını öğrenemez; değişmeyen, hash’li JavaScript ise uzun süre saklanabilir. Üçüncü örnekte host bu iki rol için ayrı `Cache-Control` başlıkları yollar:

```text title="public/_headers"
/index.html
  Cache-Control: no-cache

/assets/*
  Cache-Control: public, max-age=31536000, immutable
```

`no-cache`, “hiç saklama” demek değildir; tarayıcıdan HTML’i kullanmadan önce hostla yeniden doğrulamasını ister. `max-age=31536000` asset’in bir yıl taze sayılabileceğini, `immutable` de aynı URL’nin bu sırada değişmeyeceğini belirtir. Bu güvenlidir çünkü içerik değişince build yeni hash’li URL üretir.

Yeni sürümün izini sürelim:

| İstek | Yeni yayın öncesi | Yeni yayın sonrası |
| --- | --- | --- |
| `GET /movie/550` | Host `index.html` verir | Güncel `index.html` verilir |
| `GET /index.html` | HTML, `app-a1.js` adresini içerir | Yeniden doğrulanır; güncel HTML `app-b2.js` adresini içerir |
| `GET /assets/app-b2.js` | Dosya henüz yoktur | Yeni URL olduğu için indirilir |
| `GET /assets/app-a1.js` | Önceki sekmeler kullanıyor olabilir | Eski dosya saklı kalabilir |

Burada HTML’i yeniden doğrulamak tarayıcıya yeni asset adını öğretir. Eski asset’i hemen silmek gerekmez; daha eski bir sekme hâlâ onu kullanıyor olabilir. HTML’e de bir yıl `immutable` verirsen kullanıcı eski dosya listesini kullanabilir. Her şeye `no-store` demek güncelliği sağlar ama değişmeyen dosyaları da tekrar indirtir.

Önceki modülde gördüğün uygulama cache’i ile bunu karıştırma. TanStack Query’nin cache’i film verisini bellekte tutar; HTTP cache ise host yanıtlarını saklar. Query verisini yenilemek, tarayıcıdaki eski `index.html` politikasını değiştirmez.

## Host yapılandırmasını yanıtın kendisinde kontrol et

Kural dosyaları kullandığın hosta göre değişir. Netlify ve Cloudflare Pages `_redirects` ile `_headers` dosyalarını kullanabilir; Vercel kuralları `vercel.json` içinde tanımlar. Dosyaları yazmak yeterli kanıt değildir: yayınlanmış adrese doğrudan gir, yenile ve Network panelinde HTML ile asset yanıtlarına bak. Derin URL HTML almalı; JavaScript isteği JavaScript gövdesi almalıdır.

Bir **origin**, bir web adresinin protokol, alan adı ve porttan oluşan köküdür; örneğin `https://api.themoviedb.org`. **CSP** (Content Security Policy), tarayıcıya hangi kaynaklara bağlanabileceğini ve hangi dosyaları yükleyebileceğini söyleyen güvenlik kuralıdır. Kural, projenin kaynak koduna yorum olarak yazılınca tarayıcıya ulaşmaz; hostun HTML yanıtında `Content-Security-Policy` başlığı olarak gönderilmelidir.

Sinema’nın `fetch` istekleri için CSP’de `connect-src` kullanılır. Poster başka bir domainden geliyorsa onun izni `img-src` altında olmalıdır. Dördüncü örnekte iki istek türü ayrı izin alıyor:

```text
Content-Security-Policy: default-src 'self'; connect-src 'self' https://api.themoviedb.org; img-src 'self' https://image.tmdb.org data:
```

Bu kural sayfanın kendi origin’ine ve TMDB API’sine bağlantıya izin verir; poster için de TMDB görsel alan adını açar. API’yi `img-src` içine eklemek `fetch` isteğini düzeltmez; her direktif farklı kaynak türünü denetler. İstek engellenirse tarayıcının Console mesajında eksik direktifi ve engellenen origin’i görürsün.

:::mistake[API isteği hâlâ engelleniyor]
Belirti → Poster görünüyor ama film verisini alan `fetch` başarısız oluyor.

Neden → API adresi `img-src` içine eklenmiş; bu direktif görselleri denetler.

Düzeltme → API origin’ini hostun CSP yanıtındaki `connect-src` listesine ekle.
:::

## Preview’da gerçek yanıtı dene

Bir **preview deploy**, değişikliği ana yayına almadan önce ayrı bir adreste çalışan geçici yayındır. Preview’daki build’in ortam değişkeni ayrı olabilir. Örneğin `VITE_API_URL` preview için test API’sine ayarlanmışsa, üretilmiş JavaScript bu değeri içerir; aynı dosyayı production’a kopyalamak adresi kendiliğinden production API’sine çevirmez. Yeni değer için yeni build gerekir.

Beşinci örnek olarak preview adresinde `/movie/550` yolunu doğrudan açıp yenile. Sayfa açılırsa fallback’in çalıştığını; Network’te `/index.html` için `no-cache`, hash’li asset için uzun cache gördüğünde başlıkların geldiğini doğrulamış olursun. Ardından API isteği CSP tarafından engellenmiş mi Console’dan kontrol et. CI build’in başarılı olması bu host yanıtlarını tek başına kanıtlamaz.

## Aklında tut

- Doğrudan açılan uygulama URL’sinde ilk yanıtı React değil host verir; SPA fallback router’ın çalışmasına yetecek HTML’i sunar.
- Host var olan asset’i kendi içeriğiyle, uygulama yolunu `index.html` ile yanıtlamalıdır.
- HTML’i yeniden doğrulat; hash’li dosyaları uzun süre cache’le. İki yanıtın yenilenme ihtiyacı farklıdır.
- CSP’yi host yanıtında gönder ve API isteklerini `connect-src` ile, görselleri `img-src` ile sınırla.
- Preview adresinde doğrudan route açıp gerçek HTTP yanıtlarını kontrol et.

:::info[Derinlemesine (isteğe bağlı)]
Netlify ve Cloudflare Pages, `public/` içindeki `_redirects` ve `_headers` dosyalarını build sonrasında yayın klasörüne kopyalayabilir. Vercel bu kuralları `vercel.json` içinde tanımlar. GitHub Pages doğrudan SPA fallback sağlamaz; bu hostta 404 sayfası üzerinden ek bir çözüm gerekir.

CSP’yi ilk açarken `Content-Security-Policy-Report-Only` ile raporlamak, engelleme başlamadan önce hangi isteklerin etkileneceğini görmene yardım eder. `X-Content-Type-Options: nosniff` ve `Referrer-Policy: strict-origin-when-cross-origin` ayrı güvenlik başlıklarıdır. HTTPS’te HSTS de değerlendirilebilir; alt alan adlarını kapsayan ayarları anlamadan açma.
:::

**Yeni terimler:**

- **SPA fallback:** Hostun dosya bulamadığı uygulama yollarında `index.html` vermesi.
- **HTTP cache:** Tarayıcının HTTP yanıtlarını başlıklara göre saklayıp yeniden kullanması.
- **Hash’li asset:** İçeriği değişince URL’si de değişen yayın dosyası.
- **Origin:** Protokol, alan adı ve porttan oluşan web adresi kökü.
- **CSP:** Tarayıcının yükleyebileceği ve bağlanabileceği kaynakları sınırlayan politika.
- **Preview deploy:** Production öncesi incelemek için ayrı adreste yapılan geçici yayın.

**Kendini yokla:** `/movie/550` sayfası yenilendiğinde neden React Router tek başına 404’ü önleyemez?

*Cevap:* Router JavaScript yüklendikten sonra çalışır; önce host HTML’i başarıyla döndürmelidir.

**Kendini yokla:** HTML neden `no-cache`, hash’li asset ise uzun cache alabilir?

*Cevap:* HTML güncel asset adını taşır ve kullanmadan önce doğrulanmalıdır. İçeriği değişen asset’in URL’si değiştiği için eski URL’yi uzun süre saklamak güvenlidir.
