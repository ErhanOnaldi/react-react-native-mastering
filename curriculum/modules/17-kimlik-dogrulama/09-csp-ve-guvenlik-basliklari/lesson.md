---
title: "Content Security Policy ve temel güvenlik başlıkları"
minutes: 14
kind: concept
---

# Content Security Policy ve temel güvenlik başlıkları

Sinema'nın film detay sayfası TMDB'den poster yüklüyor ve API'ye `fetch` isteği atıyor. React kodunda güvenli davranmış olsak bile tarayıcıya bu kaynakları açıkça tarif etmek ek bir koruma katmanı sağlar.

## Tarayıcıya izin verilen kaynağı söyle

Bir **HTTP response header** (HTTP yanıt başlığı), sunucunun sayfa yanıtıyla birlikte tarayıcıya gönderdiği bir ayardır. `Content-Security-Policy` ya da kısaca **CSP**, bu başlıklardan biridir: sayfanın hangi kaynaklardan içerik yükleyebileceğini tarayıcıya söyler.

Örneğin yalnız uygulamanın kendi adresinden görsel yüklenmesine izin veren kural:

```text
Content-Security-Policy: img-src 'self'
```

Burada `img-src` bir **directive**'tir (yönerge); yani CSP içinde belirli bir içerik türü için kuraldır. `'self'`, sayfanın kendi origin'ini, yani aynı şema, alan adı ve portu anlatır. Bu ayarla uygulama kendi alanındaki görseli gösterebilir ama başka bir alandaki poster tarayıcı tarafından engellenir.

Şimdi Sinema posteri TMDB'den gelsin:

```text
Content-Security-Policy: img-src 'self' https://image.tmdb.org
```

Bu kez tarayıcı kendi alanımızdan ve `image.tmdb.org` adresinden görsel yükleyebilir. İzin listesini dar tutmak neden yararlı? Sayfada yanlışlıkla istenmeyen bir görsel kaynağı kullanılırsa tarayıcı isteği göndermez; sorun konsolda CSP ihlali olarak görünür.

## Görsel ve API isteği farklıdır

Poster yüklemek ile `fetch` çağrısı yapmak ayrı türde işlemlerdir. CSP'de `img-src` görsellerin, `connect-src` ise JavaScript'in `fetch`, `XMLHttpRequest` ve WebSocket bağlantılarının gidebileceği adresleri yönetir.

Sinema, hem TMDB posterini göstermeli hem TMDB API'sine istek atmalı:

```text
Content-Security-Policy: img-src 'self' https://image.tmdb.org; connect-src 'self' https://api.themoviedb.org
```

Yönergeler noktalı virgülle ayrılır. Görsel alanı `image.tmdb.org`, API alanı `api.themoviedb.org` olduğu için her biri doğru kurala eklenmiştir. API adresini yalnızca `img-src` içine yazarsak fetch izni vermiş olmayız; her yönerge sadece kendi içerik türünü denetler.

Birden çok kaynak denemesinin sonucu şöyle görünür:

| Tarayıcı eylemi | İlgili yönerge | İzin verilen değer | Sonuç |
| --- | --- | --- | --- |
| `/assets/app.js` yükle | `script-src 'self'` | Kendi origin'i | Script yüklenir |
| TMDB posteri yükle | `img-src 'self' https://image.tmdb.org` | TMDB görsel origin'i | Poster görünür |
| `fetch` ile TMDB API'sine bağlan | `connect-src 'self' https://api.themoviedb.org` | TMDB API origin'i | İstek yapılır |
| Bilinmeyen alan adından görsel yükle | `img-src 'self' https://image.tmdb.org` | Kaynak listede yok | Tarayıcı engeller |

Tarayıcı bir istek ya da yükleme gördüğünde ona karşılık gelen yönergeyi kontrol eder. Kaynak listede yoksa içeriği engeller; bu yüzden hata yalnızca kodda değil tarayıcının konsolunda da görünür.

Bir yönergeyi başlık metnine çevirirken adı ve kaynakları boşlukla, yönergelerin kendisini `; ` ile ayırırız. Örneğin `img-src` ve `connect-src` için iki kural böyle tek başlık değerine dönüşür. Boş kaynak listesi olan yönergeyi başlığa eklemeyiz; aksi halde ortaya gereksiz veya anlamsız bir kural çıkar. Kaynak metinlerinde baştaki ve sondaki boşlukları temizlemek de düzgün bir başlık üretir.

Örneğin kaynaklardan biri `'self'`, diğeri TMDB adresiyse `img-src: [" 'self' ", "https://image.tmdb.org"]` girdisi `img-src 'self' https://image.tmdb.org` kuralına dönüşür. Boşluklar temizlenip kaynaklar tek boşlukla birleştirilir; boş `font-src` listesi varsa o yönerge çıktıda yer almaz.

## Varsayılan kuralı ve çerçevelenmeyi ekle

Bir sayfada her içerik türü için özel yönerge yazmak istemeyebilirsin. `default-src`, ayrıca kuralı bulunmayan türler için varsayılan kaynak listesidir. Özel yönerge varsa kendi türünde `default-src` yerine o kullanılır.

Sinema'nın ilk politikası kendi kaynağını varsayılan yapıp poster ve API için gerekli iki istisnayı ekleyebilir:

```text
Content-Security-Policy: default-src 'self'; img-src 'self' https://image.tmdb.org; connect-src 'self' https://api.themoviedb.org
```

Örneğin `font-src` özel olarak yazılmadığı için varsayılan kaynak kuralına uyar. Ama `img-src` açıkça tanımlandığından posterler için `default-src` kullanılmaz; posterin adresi `img-src` izinlerinde olmalıdır. Böylece genel kural dar kalırken ihtiyaç duyulan dış kaynaklar görünür biçimde listelenir.

Başka bir site uygulamanı gizli bir `<iframe>` içine koyup ziyaretçiyi oradaki görünmez düğmelere tıklatmaya çalışabilir. Bu aldatma **clickjacking** (tıklama hırsızlığı) olarak bilinir. Sayfanın nerelerde çerçeve içine alınabileceğini `frame-ancestors` belirler:

```text
Content-Security-Policy: default-src 'self'; frame-ancestors 'none'
```

`'none'`, hiçbir sitenin sayfayı iframe içine gömemeyeceğini söyler. `frame-src` ise ters yönlü bir kuraldır: senin sayfandaki iframe'lerin nereden yüklenebileceğini söyler. İki yönergenin adları benzer olsa da denetledikleri taraflar farklıdır.

## Politikayı canlıya almadan önce gözle

Yeni bir CSP kuralı yanlışsa çalışan bir özelliği de engelleyebilir. Örneğin `img-src` listesine TMDB'yi eklemeyi unutursan posterler kaybolur. Bunu canlıda direkt zorunlu kural yapmadan önce `Content-Security-Policy-Report-Only` başlığıyla denemek mümkündür:

```text
Content-Security-Policy-Report-Only: default-src 'self'; img-src 'self'
```

`Report-Only` tarayıcıya ihlalleri raporlamasını söyler ama kaynağı engellemez. Böylece politikayı gerçek sayfada gözleyip eksik izinleri bulabilirsin. Doğru olduğuna karar verince `Content-Security-Policy` başlığıyla kuralı uygularsın. Vite geliştirme sunucusu HMR (hot module replacement; dosyayı kaydedince modülü sayfayı tümden yenilemeden değiştirme) için WebSocket ve satır içi kaynaklar kullanabildiğinden, sıkı üretim politikası geliştirme ortamını bozabilir; CSP'yi genellikle dağıtım sunucusunda yapılandırırız.

:::mistake[API adresini yalnızca img-src içine yazmak]
**Belirti:** TMDB posteri görünür ama `fetch` isteği konsolda CSP tarafından engellenir.  
**Neden:** `img-src` görsel isteklerini denetler; JavaScript'in ağ bağlantılarını denetlemez.  
**Düzeltme:** API origin'ini `connect-src` yönergesine ekle.
:::

:::mistake[frame-src ile sayfanın gömülmesini engellemeye çalışmak]
**Belirti:** `frame-src 'none'` yazmana rağmen başka bir site sayfanı iframe içine gömebilir.  
**Neden:** `frame-src`, senin sayfanda açılan iframe'in kaynağını sınırlar; dış sitelerin seni çerçevelemesini yönetmez.  
**Düzeltme:** Gömülmeyi sınırlamak için `frame-ancestors 'none'` kullan.
:::

:::mistake[Report-Only'ı kalıcı koruma sanmak]
**Belirti:** Konsolda ihlal raporu vardır ama tarayıcı istenmeyen kaynağı yine yükler.  
**Neden:** `Report-Only` gözlem modudur; ihlali raporlar, engellemez.  
**Düzeltme:** Politikayı gözleyip doğruladıktan sonra zorlayıcı `Content-Security-Policy` başlığına geçir.
:::

:::info[Derinlemesine (isteğe bağlı)]
`script-src`, çalıştırılabilir JavaScript dosyalarının kaynağını sınırlar. Satır içi script gerekiyorsa `'unsafe-inline'` ile korumayı gevşetmek yerine, sunucunun ürettiği tek kullanımlık `nonce` değeri ya da script içeriğinin hash'iyle (kısa parmak iziyle) izin vermek mümkündür. `object-src 'none'` eski eklentileri, `base-uri` `<base>` etiketinin hedefini sınırlar. `X-Content-Type-Options: nosniff` tarayıcının MIME türünü (dosyanın içerik türü, örneğin HTML ya da JavaScript) içerikten tahmin etmesini engeller. HSTS (HTTP Strict Transport Security) tarayıcıya sonraki ziyaretlerde HTTPS kullanmasını söyler. Bunlar farklı HTTP başlıklarıdır ve uygulama dağıtımında ayrıca yapılandırılır; bu dersin ana konusu değildir.
:::

## Özet

- CSP, HTTP yanıt başlığıyla tarayıcıya hangi kaynakların kabul edileceğini bildirir.
- `img-src` görselleri, `connect-src` ise `fetch` gibi ağ bağlantılarını sınırlar.
- `default-src` açıkça kural verilmeyen kaynak türlerine uygulanır; özel yönerge kendi türü için önceliklidir.
- `frame-ancestors 'none'` başkalarının sayfanı iframe içine koymasını önler; `frame-src` sayfanın yüklediği iframe'leri yönetir.
- `Report-Only` politikayı gözlemlemeye yarar, engelleme yapmaz; uygulanacak kural `Content-Security-Policy` başlığıdır.

**Yeni terimler**

- `HTTP response header`: Sunucunun HTTP yanıtıyla tarayıcıya gönderdiği ayar bilgisi.
- `CSP`: Tarayıcının yükleyebileceği ve bağlanabileceği kaynakları sınırlayan politika.
- `directive`: CSP içinde bir içerik türünün kuralını belirleyen yönerge.
- `origin`: Şema, alan adı ve portun oluşturduğu web adresi kökeni.
- `clickjacking`: Kullanıcıyı gizlenmiş veya yanıltıcı bir çerçevede tıklatmaya dayanan saldırı.
- `Report-Only`: CSP'yi engellemeden, ihlalleri gözlemleme modu.

**Kendini yokla**

1. Poster için TMDB görsel alanı, API için TMDB API alanı gerekiyorsa hangi yönergeler kullanılır?  
   *Poster `img-src`, `fetch` isteği `connect-src` ile izin alır.*
2. `default-src 'self'` yanında `img-src 'self' https://image.tmdb.org` varsa `https://evil.example/p.jpg` yüklenir mi?  
   *Hayır. Görseller için özel `img-src` yönergesi varsayılanın yerine geçer ve `evil.example` listede yoktur.*
