---
title: "Content Security Policy ve temel güvenlik başlıkları"
minutes: 14
kind: concept
---

# Content Security Policy ve temel güvenlik başlıkları

:::pain[Enjekte edilen reklam script'i ve görünmez iframe tuzağı]
Kullanıcı yorumları arasında sızan küçük bir betik, harici bir sunucudan gizlice madencilik ve reklam script'i indiriyor; tarayıcı hiçbir kısıtlama olmadan bu yabancı alan adına bağlanıp kodu çalıştırıyor. Bir başka sayfada ise uygulamanın oturum ekranı, saldırganın hazırladığı şeffaf bir `<iframe>` içine gömülmüş durumda; kullanıcı oyun butonuna tıkladığını sanırken arka planda "Hesabı Sil" düğmesine basıyor. Çıkış noktasını kaçışlamak tek başına yeterli bir savunma hattı oluşturmadığında, tarayıcının kaynak politikaları devreye girmelidir.
:::

## Tarayıcının kaynak kalkanı: CSP

Content Security Policy (CSP), sunucunun HTTP yanıt başlığında (`Content-Security-Policy`) tarayıcıya gönderdiği ve tarayıcının o sayfa için izin verilen kaynakları katı kurallarla kısıtlamasını sağlayan bir güvenlik mekanizmasıdır.

React bileşenlerinde metin kaçışlaması yapmak XSS riskini büyük ölçüde azaltsa da, üçüncü parti kütüphaneler, unutulmuş `href` bağlantıları veya DOM manipülasyonları zafiyet yaratabilir. CSP, kodda bir açık oluşsa bile saldırganın harici bir sunucudan betik yüklemesini veya çalınan veriyi dışarı sızdırmasını (data exfiltration) engelleyen son savunma ağıdır.

### Temel CSP yönergeleri

Bir CSP başlığı noktalı virgülle ayrılmış yönergelerden oluşur. Her yönerge belirli bir kaynak tipini denetler:

1. **`default-src`:** Özel olarak tanımlanmamış tüm kaynak türleri için geçerli varsayılan kuralı belirler. Genellikle `'self'` (yalnızca uygulamanın kendi etki alanı) olarak ayarlanır.
2. **`script-src`:** Hangi kaynaklardan JavaScript çalıştırılabileceğini sınırlar. Varsayılan olarak satır içi betikleri (`<script>alert(1)</script>` veya `onclick` özniteliklerini) engeller. Güvenli satır içi kodlar için sunucunun ürettiği rastgele tek kullanımlık belirteçler (`'nonce-...'`) veya SHA hash'leri kullanılır.
3. **`img-src`:** Sayfada görüntülenebilecek görsellerin (`<img>`, CSS arka planları, favicon) etki alanlarını belirler. Örneğin Sinema uygulamasında TMDB posterleri için `https://image.tmdb.org` ve yerel base64 önizlemeleri için `data:` kaynağı eklenmelidir.
4. **`connect-src`:** JavaScript'in `fetch`, `XMLHttpRequest` veya WebSocket ile ağ isteği atabileceği uç noktaları sınırlar. Uygulamanın bağlandığı TMDB API (`https://api.themoviedb.org`) veya oturum sunucusu bu listede yer almalıdır.
5. **`frame-ancestors`:** Sayfanın başka siteler tarafından `<iframe>`, `<frame>`, `<object>` veya `<embed>` içine gömülüp gömülemeyeceğini denetler. Clickjacking saldırılarını engellemek için `'none'` atanır.
6. **`object-src`:** Flash, Java applet gibi eski ve güvensiz eklentileri kısıtlar. Modern uygulamalarda her zaman `'none'` olarak ayarlanır.
7. **`base-uri`:** Sayfadaki `<base href="...">` etiketinin işaret edebileceği etki alanını kısıtlar; göreli linklerin saldırganın sitesine yönlendirilmesini önlemek için `'self'` verilir.

## Clickjacking ve frame-ancestors

Clickjacking (tıklama hırsızlığı), saldırganın hedef web sitesini kendi sayfasında görünmez veya yarı saydam bir `<iframe>` içine yerleştirmesi ve kullanıcının ilgisini çekecek sahte bir görselin (örneğin "Ödül Kazan" butonu) altına tam hedef düğmenin ("Hesabımı Kapat" veya "Parayı Transfer Et") denk getirilmesiyle gerçekleşir.

Kullanıcı sahte butona tıkladığında aslında görünmez çerçevenin içindeki düğmeyi tetiklemiş olur.

Geçmişte bu saldırı `X-Frame-Options: DENY` veya `SAMEORIGIN` HTTP başlığıyla engelleniyordu. Modern web standartlarında bu kuralın yerini CSP'nin `frame-ancestors` yönergesi almıştır:

- `frame-ancestors 'none';` → Sayfa hiçbir sitede (kendi sitesi dahil) iframe içine gömülemez.
- `frame-ancestors 'self';` → Sayfa yalnızca kendi etki alanı altındaki sayfalarda iframe içine alınabilir.
- `frame-ancestors https://guvenilir-ortak.example;` → Yalnızca belirtilen harici etki alanının sayfayı gömmesine izin verilir.

## Politika değerlendirme ve ihlal süreci

Tarayıcı bir HTML belgesini yüklerken gelen başlığı adım adım işler:

| Kaynak / Eylem | Örnek İstek | İlgili Yönerge | Karar Kuralı | Sonuç |
| --- | --- | --- | --- | --- |
| Uygulama bundle'ı | `<script src="/assets/index.js">` | `script-src 'self'` | Kendi origin'i ile eşleşti | Yüklendi ve çalıştı |
| Kötü amaçlı betik | `<script src="https://evil.example/bot.js">` | `script-src 'self'` | `evil.example` listede yok | Tarayıcı engelledi (Console CSP Error) |
| Film posteri | `<img src="https://image.tmdb.org/t/p/w500/...">` | `img-src 'self' https://image.tmdb.org` | TMDB etki alanı izin listesinde | Görsel başarıyla render edildi |
| Bilinmeyen görsel | `<img src="https://saldirgan.example/tracker.png">` | `img-src 'self' https://image.tmdb.org` | Listedeki kaynaklarla uyuşmuyor | Görsel engellendi, istek gitmedi |
| Harici API çağrısı | `fetch('https://api.themoviedb.org/3/...')` | `connect-src 'self' https://api.themoviedb.org` | API etki alanı izinli | Yanıt başarıyla alındı |

## Önce kırık, sonra doğru: Güvenlik başlıklarını kurgulamak

Statik bir SPA yayınlanırken veya bir Node/ASP.NET Core sunucusu yapılandırılırken başlıkların doğru kurgulanması gerekir.

Önce hiçbir kısıtlama yapmayan veya satır içi betiklere açık güvensiz başlık yapılandırmasını görelim:

```http title="Eksik ve Güvensiz Başlıklar"
HTTP/1.1 200 OK
Content-Type: text/html
/* HATA: CSP tanımlanmamış, iframe kısıtlaması yok, MIME sniffing açık */
```

Şimdi uygulamanın tüm ihtiyaçlarını kapsayan ve gereksiz izinleri kapatan güvenli CSP ve güvenlik başlıkları kümesini inceleyelim:

```ts check title="src/shared/config/securityHeaders.ts"
export interface SecurityPolicyConfig {
  allowedApiOrigins: string[]
  allowedImageOrigins: string[]
  allowFraming?: boolean
}

export function formatSecurityPolicy(config: SecurityPolicyConfig): string {
  const directives: string[] = [
    "default-src 'self'",
    "script-src 'self'",
    `img-src 'self' ${config.allowedImageOrigins.join(' ')} data:`.trim(),
    `connect-src 'self' ${config.allowedApiOrigins.join(' ')}`.trim(),
    "object-src 'none'",
    "base-uri 'self'",
  ]

  if (config.allowFraming) {
    directives.push("frame-ancestors 'self'")
  } else {
    directives.push("frame-ancestors 'none'")
  }

  return directives.join('; ')
}
```

Bu politikayı uygulayan örnek HTTP yanıt başlıkları:

```http title="Üretim Güvenlik Başlıkları"
Content-Security-Policy: default-src 'self'; script-src 'self'; img-src 'self' https://image.tmdb.org data:; connect-src 'self' https://api.themoviedb.org; object-src 'none'; base-uri 'self'; frame-ancestors 'none'
X-Content-Type-Options: nosniff
Referrer-Policy: strict-origin-when-cross-origin
Strict-Transport-Security: max-age=31536000; includeSubDomains
```

## Diğer temel güvenlik başlıkları

Tek başına CSP tüm saldırı vektörlerini kapatmaz; tarayıcının diğer güvenlik mekanizmalarını devreye sokan ek başlıklar kullanılır:

1. **`X-Content-Type-Options: nosniff`:** Tarayıcının sunucudan gelen `Content-Type` başlığını görmezden gelip dosya içeriğine bakarak MIME türü tahmin etmesini (MIME-sniffing) engeller. Örneğin bir kullanıcının yüklediği zararsız görünen bir metin dosyasının tarayıcı tarafından HTML veya JavaScript olarak çalıştırılmasını önler.
2. **`Strict-Transport-Security` (HSTS):** Tarayıcıya sitenin gelecekteki tüm ziyaretlerde yalnızca HTTPS üzerinden açılması gerektiğini bildirir (`max-age=31536000; includeSubDomains`). Kullanıcının yanlışlıkla `http://` yazması durumunda bile tarayıcı ağa çıkmadan önce bağlantıyı HTTPS'e yükseltir.
3. **`Referrer-Policy: strict-origin-when-cross-origin`:** Kullanıcı siteden dışarıdaki bir bağlantıya tıkladığında giden `Referer` başlığında hassas URL parametrelerinin sızmasını önler. Aynı origin'de tam yol gönderilirken, harici sitelere yalnızca sitenin kök etki alanı iletilir.

## Report-Only modu ve Dev/Prod ayrımı

Katı bir CSP politikasını doğrudan canlı ortama almak, gözden kaçan bir görsel kaynağını veya analiz aracını kırarak kullanıcı deneyimini bozabilir.

1. **`Content-Security-Policy-Report-Only`:** Bu başlık ihlalleri engellemez; yalnızca tarayıcı konsoluna yazar ve tanımlanmışsa `report-to` uç noktasına JSON raporu gönderir. Böylece üretimde gerçek kullanıcıların hangi kaynakları tetiklediği ölçülür, politika olgunlaşınca asıl `Content-Security-Policy` başlığına geçilir.
2. **Vite ve Geliştirme Ortamı:** `vite dev` çalışırken sıcak modül yenileme (HMR), hata bildirim pencereleri ve stil enjeksiyonları için satır içi script'ler (`inline scripts`) ve yerel WebSocket bağlantıları kullanılır. Bu nedenle sıkı CSP politikaları genellikle yerel dev sunucusunda değil, üretim dağıtımında (Netlify/Cloudflare `_headers` dosyası, Nginx veya ters vekil sunucu yapılandırması) uygulanır.

## Sık hatalar ve düzeltmeleri

:::mistake[script-src içine unsafe-inline eklemek]
**Belirti:** CSP başlığı eklendiği halde XSS zafiyeti tespit ediliyor ve saldırganın eklediği script sorunsuz çalışıyor.  
**Neden:** `script-src 'self' 'unsafe-inline'` tanımlanmıştır. `'unsafe-inline'` bayrağı satır içi betik korumasını tamamen kapatır ve CSP'nin en kritik savunma kalkanını düşürür.  
**Düzeltme:** Satır içi betik gerekiyorsa `'unsafe-inline'` yerine sunucu tarafından üretilen `'nonce-...'` veya kodun SHA hash'ini kullan.
:::

:::mistake[frame-ancestors yerine frame-src ile clickjacking engellemeye çalışmak]
**Belirti:** CSP başlığına `frame-src 'none'` yazıldığı halde saldırgan site sayfayı iframe içine gömebiliyor.  
**Neden:** `frame-src`, uygulamanın kendi içinde açabileceği iframe'leri sınırlar. Başka sitelerin bu uygulamayı gömmesini denetleyen yönerge ise `frame-ancestors` yönergesidir.  
**Düzeltme:** Sayfanın gömülmesini engellemek için `frame-ancestors 'none'` kuralını kullan.
:::

:::mistake[connect-src yönergesine API etki alanını eklemeyi unutmak]
**Belirti:** Uygulama yerelde çalışırken canlıya alındığında tüm `fetch` istekleri `Refused to connect` hatasıyla başarısız oluyor.  
**Neden:** `connect-src 'self'` tanımlanmış ancak API'nin bulunduğu harici etki alanı (`https://api.themoviedb.org`) listeye eklenmemiştir.  
**Düzeltme:** Uygulamanın istek attığı tüm API etki alanlarını `connect-src` listesine açıkça dahil et.
:::

:::sector[Sektör standardı: Statik hostlarda CSP dağıtımı]
Vite gibi araçlarla derlenen statik SPA'larda CSP başlıkları genellikle HTML `<meta http-equiv="Content-Security-Policy">` etiketiyle ya da statik sunucu başlık dosyalarıyla dağıtılır. Ancak `frame-ancestors` ve `report-to` yönergeleri `<meta>` etiketi içinde desteklenmez; tarayıcı bunları yalnızca gerçek HTTP yanıt başlıklarında kabul eder. Bu yüzden Netlify `public/_headers`, Vercel `vercel.json` ya da Cloudflare Pages başlık kuralları sektör standardıdır.
:::

## Özet

- CSP (Content Security Policy), tarayıcının çalıştırabileceği betikleri, yükleyebileceği görselleri ve ağ isteklerini kısıtlayan son savunma hattıdır.
- `default-src 'self'` genel kısıtlamayı belirlerken, `img-src` ve `connect-src` üçüncü taraf API ve görsel sağlayıcılarına kontrollü izin verir.
- Clickjacking saldırısına karşı sayfayı iframe gömülmelerinden korumak için `frame-ancestors 'none'` kuralı kullanılır.
- `X-Content-Type-Options: nosniff` MIME tahminini engeller; HSTS HTTPS kullanımını zorunlu tutar.
- Yeni politikalar önce `Content-Security-Policy-Report-Only` ile canlıda ölçülür; dev ortamındaki HMR araçlarını engellememek için sıkı CSP prodüksiyon sunucu başlıklarında verilir.

### Kendini yokla

1. Bir web sitesinde `default-src 'self'` ve `img-src 'self' https://image.tmdb.org` tanımlıysa, sitede `<img src="https://evil.example/pic.jpg">` etiketi nasıl davranır?
*Cevap:* Tarayıcı `img-src` listesini denetler; `evil.example` izin verilen kaynaklar arasında olmadığı için görseli yüklemeyi reddeder ve konsola bir CSP ihlal hatası yazar.

2. `frame-ancestors 'none'` yönergesi hangi saldırı türünü doğrudan engeller?
*Cevap:* Clickjacking saldırısını engeller; saldırganın sayfayı kendi hazırladığı gizli bir `<iframe>` içine gömerek kullanıcıya fark ettirmeden tıklama yaptırmasını imkansız hale getirir.
