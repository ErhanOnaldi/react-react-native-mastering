---
title: "Statik SPA’yı yayına alma"
minutes: 14
kind: concept
---

# Statik SPA’yı yayına alma

:::pain[Paylaşılan film bağlantısı açılmıyor]
Sinema’da bir filmi açıp `/movie/550` adresini arkadaşına yolluyorsun. Uygulama içinden tıklayınca detay görülüyor; arkadaşın aynı adresi yeni sekmede açınca statik host 404 veriyor. Bir gün sonra yeni sürüm yayınlanıyor, ama bazı kullanıcılar hâlâ eski ekranı görüyor. Dosyaları yüklemek tek başına yeterli değil: hostun URL ve cache davranışı da uygulamanın parçası.
:::

## İlk HTTP isteğinde React henüz çalışmaz

Tarayıcı bir adresi doğrudan açtığında ilk isteği host karşılar. `/movie/550` için `dist/movie/550` adlı bir dosya yoktur. React Router ancak `index.html` ve JS yüklendikten sonra URL’yi okuyabilir. Bu sırayı ters çeviremeyiz. Host, uygulama route’u olan bilinmeyen yollarda `index.html` içeriğini **200** yanıtıyla sunmalıdır; URL adres çubuğunda `/movie/550` kalır. Buna SPA fallback denir.

:::model[URL state]
URL, film kimliği gibi paylaşılabilir durumun kaynağıdır. Uygulama içindeki gezinmede router bu URL’ye göre doğru sayfayı seçer. Doğrudan açılışta yeni olan şey, router’dan önce hostun ilk HTML yanıtını üretmesidir; host fallback vermeden router’a sıra gelmez.
:::

![Build çıktısının host üzerinden tarayıcıya gitmesi ve derin URL için HTML fallback](diagram:build-ve-yayin "Host, hashli dosyaları ve HTML belgesini farklı kurallarla sunar.")

Yayının dört kesin kuralı var:

1. **Önce gerçek dosya sunulur.** `/assets/index-a41c.js` gibi var olan dosya kendi içeriğiyle döner. SPA fallback, uygulama route’ları için devreye girer; asset isteğinin yerine HTML verilirse tarayıcı MIME hatası alır.
2. **Derin uygulama URL’si HTML alır.** `/movie/550` için host `index.html` gövdesini başarılı yanıtla verir. Ardından JS yüklenir ve router 550 parametresini çözer.
3. **HTML güncelliği korur.** `index.html` için `Cache-Control: no-cache` saklamayı yasaklamaz; kullanmadan önce sunucuyla doğrulama ister. Böylece yeni build’in işaret ettiği hash’li dosya adı öğrenilir.
4. **Hash’li asset uzun saklanır.** `/assets/index-a41c.js` için `public, max-age=31536000, immutable` uygundur. İçerik değişirse build yeni URL üretir; eski dosyayı cache’ten atmaya gerek kalmaz.

Üçüncü ve dördüncü kurallar HTTP cache dersindeki iki katmanı hatırlatır. Tarayıcı HTTP yanıtını başlıklara göre saklar. TanStack Query’nin belleğindeki film verisi başka bir cache’tir; uygulama sorgusunu invalid etmek, tarayıcının eski `index.html` dosyasını yeniden doğrulama kuralını düzeltmez.

:::model[HTTP cache kararı]
Tarayıcı taze yanıtı doğrudan kullanır; bayat yanıtı ETag gibi bir doğrulayıcıyla sunucuya sorabilir. `no-cache`, “asla saklama” değil “kullanmadan önce doğrula” demektir. Yayında bu ayrım HTML için güncel asset listesini, hash’li asset için tekrar indirmeden hızlı açılışı sağlar.
:::

## Yeni sürümün yolculuğunu izle

İlk yayında HTML `index-a41c.js` dosyasına işaret ediyor. Sonra yeni özellik build edilip `index-b82d.js` çıkıyor.

| İstek | İlk yayın | Yeni yayın sonrası beklenen |
| --- | --- | --- |
| `GET /movie/550` | Host `index.html` gövdesini 200 ile verir | Aynı fallback güncel HTML’i verir |
| `GET /index.html` | Tarayıcı HTML’i alır | `no-cache` nedeniyle yeniden doğrular veya yeni gövdeyi alır |
| `GET /assets/index-b82d.js` | Henüz yok | Yeni URL olduğu için indirilir |
| `GET /assets/index-a41c.js` | Uzun süre cachelenebilir | Eski sekmeler için saklanması sorun değildir |

Eğer HTML’e de bir yıl `immutable` verirsen kullanıcı yeni JS adını öğrenemez. Eğer tüm dosyalara `no-store` verirsen doğruluk korunabilir, fakat her açılışta gereksiz aktarım yaparsın. Dosya türlerinin rolü farklı olduğu için başlıkları da farklıdır.

## Host dosyaları ve kırık örnek

Netlify ve Cloudflare Pages için `public/` içine konan `_redirects` ile `_headers`, build sonrasında `dist/` köküne kopyalanır. Vercel aynı davranışı JSON rewrite ve header kurallarıyla tanımlar.

Kırık Vercel ayarı yalnızca dosya cache başlığı verir. `/etkinlik/42` isteğinde host hâlâ o adla fiziksel bir dosya arar ve 404 döndürür:

```json title="vercel.json (kırık)"
{
  "headers": [{ "source": "/(.*)", "headers": [{ "key": "Cache-Control", "value": "no-cache" }] }]
}
```

Doğru örnek hem rewrite hem de dosya türüne göre başlık verir:

```json title="vercel.json"
{
  "rewrites": [{ "source": "/(.*)", "destination": "/index.html" }],
  "headers": [
    {
      "source": "/assets/(.*)",
      "headers": [{ "key": "Cache-Control", "value": "public, max-age=31536000, immutable" }]
    },
    {
      "source": "/index.html",
      "headers": [{ "key": "Cache-Control", "value": "no-cache" }]
    }
  ]
}
```

Netlify ve Cloudflare Pages metin dosyalarını, Vercel ise `vercel.json` dosyasını okur. GitHub Pages doğrudan SPA fallback sunmadığı için orada 404 sayfası tabanlı bir çözüm gerekir. Host seçerken yalnızca “statik dosya sunuyor mu?” diye bakma; derin URL yenileme ve başlık kurallarını da dene.

Bir pull request için verilen geçici preview URL’si, bu ayarları production öncesi görmeyi sağlar. Preview build’in env değerleri ayrı olabilir: `VITE_API_URL` staging için build edildiyse production’a aynı dosyayı koymak production API’sine otomatik geçmez. Değeri değiştirmek için yeni build gerekir.

Preview deploy’u yalnızca tasarım incelemesi için kullanma. Derin URL’yi doğrudan aç, yenile, bir JS/CSS asset’inin gövde türünü ve cache header’ını Network’te kontrol et. Böylece fallback’in yanlışlıkla HTML’i asset isteğine vermesi gibi sorunları görürsün. Deploy adresi geçici olsa bile host kuralı production ile aynıysa iyi bir erken kanıt sağlar.

## CSP de host yanıtının parçasıdır

Sinema’nın JS’i TMDB ve DummyJSON’a bağlanıyorsa CSP `connect-src` listesi bu origin’leri içermelidir. Posterler başka bir origin’den geliyorsa `img-src` ayrıca ayarlanır. CSP’yi yalnızca kaynak dosyasında yorum olarak yazmak tarayıcıya kural göndermez; hostun HTML yanıtında `Content-Security-Policy` başlığı olmalıdır.

:::model[XSS çıkışları ve CSP]
React metin düğümlerinde güvenilmeyen içeriği kaçışlar, ama tehlikeli DOM çıkışları ve üçüncü parti script’ler hâlâ risk oluşturabilir. CSP, tarayıcının hangi kaynağı çalıştırıp hangisine bağlanacağını sınırlar. Yayında yeni olan, politikayı build kodunda değil hostun HTTP yanıtında uygulamandır.
:::

Örnek bir yayın başlığı `default-src 'self'; script-src 'self'; img-src 'self' https://image.tmdb.org data:; connect-src 'self' https://api.themoviedb.org https://dummyjson.com; object-src 'none'; base-uri 'self'; frame-ancestors 'none'` olabilir. Uygulamanın başka kaynakları varsa politika onların gerçek kullanımına göre gözden geçirilir. `X-Content-Type-Options: nosniff` ve `Referrer-Policy: strict-origin-when-cross-origin` ayrı HTTP başlıklarıdır. HTTPS yayında HSTS de değerlendirilebilir; alt alan adlarını etkileyecek bir politika aceleyle açılmaz. Yeni CSP önce Report-Only ile gözlenebilir.

:::mistake[Derin URL 404]
Belirti → Ana sayfadan film detayı açılıyor, aynı URL yenilenince 404.  
Neden → Host dosya arıyor ve `index.html` fallback’i vermiyor.  
Düzeltme → Hostun SPA yönlendirmesini ekle; doğrudan `/movie/550` isteğinin 200 ve HTML döndürdüğünü kontrol et.
:::

:::mistake[Yeni sürüm görünmüyor]
Belirti → Yayın sonrası bazı kullanıcılarda eski JS çalışıyor.  
Neden → Eski HTML uzun süre taze kabul edilip yeni hash’li asset’e işaret etmiyor.  
Düzeltme → HTML’i yeniden doğrulat, hash’li asset’e uzun cache ver; gerçek yanıt başlıklarını Network’ten oku.
:::

:::mistake[CSP tüm istekleri kesiyor]
Belirti → Yerelde çalışan API çağrısı yayında “Refused to connect” ile duruyor.  
Neden → Hostun `connect-src` listesinde API origin’i yok.  
Düzeltme → Gerçek istek origin’ini izin listesine ekle; gereksiz geniş `*` izni verme.
:::

:::sector[Sektörde]
Yayın kontrolünde ekip bir preview URL’sinde doğrudan film bağlantısı açar, sayfayı yeniler, Network’te HTML ve asset yanıt başlıklarını okur, ardından CSP Console uyarılarını inceler. CI’daki başarılı build bu HTTP davranışlarını tek başına ispatlamaz; host yapılandırması da ürünün parçasıdır.
:::

## Özet

- Doğrudan SPA route’u açılınca host önce `index.html` yanıtını vermelidir.
- `index.html` yeniden doğrulanır; hash’li asset’ler uzun süre cachelenebilir.
- Netlify ve Cloudflare Pages `_redirects` ile `_headers`; Vercel kendi JSON yapılandırmasını kullanır.
- Preview deploy, gerçek host davranışını ve ortama özel build’i sınamak için kullanılır.
- CSP ve güvenlik başlıkları hostun HTTP yanıtında uygulanır.

**Kendini yokla:** `/movie/550` yenilenince neden React Router tek başına 404’ü çözemez?  
*Cevap:* Router çalışmadan önce hostun ilk HTML isteğini yanıtlaması gerekir.

**Kendini yokla:** Hash’li JS’e uzun cache verirken HTML’e neden aynı kuralı vermezsin?  
*Cevap:* HTML yeni sürümdeki dosya adını taşır; eski HTML taze sayılırsa kullanıcı yeni asset’i öğrenemez.
