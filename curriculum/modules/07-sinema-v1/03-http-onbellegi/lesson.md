---
title: "HTTP önbelleği ve doğrulama"
minutes: 17
kind: concept
---

# HTTP önbelleği ve doğrulama

:::pain[Problem]
Kullanıcı Sinema uygulamasında ana sayfaya giriyor; 2 MB büyüklüğündeki JavaScript paketi ve onlarca film verisi iniyor. Bir filmin detayına tıklayıp hemen ardından geri tuşuna basıyor. Network sekmesine bakıyorsun: Aynı 2 MB JavaScript paketi ve az önce çektiğin film listesi sıfırdan tekrar iniyor! Sayfa her geçişte gereksiz yere bekletiyor ve kullanıcının mobil internet kotasını tüketiyor. Öte yandan bu sorunu çözmek için tüm dosyaları kalıcı önbelleğe aldığında, yeni bir özellik yayınladığında kullanıcıların tarayıcısında eski kod kaldığı için arayüzün çöktüğünü görüyorsun.
:::

## İki ayrı dünya: Tarayıcı HTTP önbelleği vs Uygulama önbelleği

Önbellek (caching) dendiğinde modern web geliştirmede iki farklı katman bulunur ve bu iki katmanı birbirine karıştırmamak gerekir:

1. **Uygulama İçi Önbellek (Client State / TanStack Query):** JavaScript belleğinde (`RAM`) tutulan nesnelerdir. Bileşen unmount olduğunda ya da sayfa yenilendiğinde özel bir kalıcılık (persistence) katmanı yoksa sıfırlanır.
2. **HTTP Önbelleği (RFC 9111 HTTP Caching):** Tarayıcının diskinde veya işletim sistemi düzeyinde yönetilen yerel depodur. Sunucunun gönderdiği HTTP başlıklarına göre çalışır; sayfa yenilense veya tarayıcı kapatılıp açılsa bile geçerliliğini korur.

HTTP önbelleğinin temel amacı bellidir: **En hızlı ve en ucuz istek, hiç atılmayan ya da gövde indirmeyen istektir.**

![HTTP önbellek karar ve doğrulama akışı](diagram:http-onbellek-karari)

## Taşıyıcı zihinsel model: Cache-Control yönergeleri

Sunucu, tarayıcıya bir veriyi nasıl saklaması gerektiğini `Cache-Control` cevap başlığıyla emreder. Bu başlık virgülle ayrılmış yönergeler (directives) taşır:

1. **`max-age=N` (Tazelik Süresi):** Yanıtın üretildiği andan itibaren kaç saniye boyunca "taze" (fresh) sayılacağını belirtir (`max-age=3600` → 1 saat). Bu süre zarfında tarayıcı sunucuya hiç gitmez; veriyi doğrudan yerel diskten (`disk cache`) ya da bellekten (`memory cache`) anında sunar.
2. **`no-cache` (Kullanmadan Önce Doğrula):** En sık yanlış anlaşılan yönergedir. `no-cache`, "önbelleğe alma" demek **değildir**! "Bu cevabı önbelleğe saklayabilirsin; ancak kullanıcıya sunmadan önce MUTLAKA sunucuya sorup verinin hâlâ güncel olduğunu doğrulatmalısın" demektir.
3. **`no-store` (Kesinlikle Saklama):** Cevabın hiçbir şekilde diske veya belleğe kaydedilmesine izin vermez. Kredi kartı bilgileri, kişisel sağlık verileri gibi gizlilik gerektiren uç noktalarda kullanılır. Her istekte veri sıfırdan indirilir.
4. **`public` ve `private`:** `public`, cevabın CDN ve vekil sunucular (proxy) gibi paylaşılan aracı önbelleklerde de saklanabileceğini bildirir. `private` ise cevabın yalnızca son kullanıcının tarayıcısına özel olduğunu, aradaki CDN'lerin bu cevabı başkalarına sunamayacağını garantiler.
5. **`immutable` (Değişmez İçerik):** `max-age` süresi boyunca dosyanın sunucuda asla değişmeyeceğini taahhüt eder. Kullanıcı sayfayı F5 ile yenilese dahi tarayıcı sunucuya doğrulama isteği yollamaz.
6. **`stale-while-revalidate=N`:** Önbellekteki veri bayatlamış olsa dahi ilk anda kullanıcıya o bayat veriyi hemen göster, arka planda sunucuya asenkron istek atarak önbelleği sessizce tazele.

:::model[HTTP Önbellek Karar Döngüsü]
Tarayıcı bir kaynağa erişmek istediğinde şu üç adımlı kesin algoritmayı işletir:  
1. **Yerel kopya var mı ve taze mi?** Cevap önbellekte varsa ve `max-age` süresi dolmamışsa (ve `no-cache` yoksa), ağa hiç çıkılmaz. Konsolda durum kodu `200 (from disk cache)` görünür. Süre: ~0 ms.  
2. **Bayat ama doğrulanabilir mi?** Süre dolmuşsa (`stale`), tarayıcı sunucuya bir koşullu istek (conditional request) atar: "Bendeki kopyanın etiketi bu (`If-None-Match`). İçerik değişti mi?"  
3. **304 mü, 200 mü?** Sunucudaki içerik değişmediyse sunucu gövdesiz bir `304 Not Modified` yanıtı döner. Tarayıcı diskteki eski kopyayı kullanmaya devam eder. İçerik değiştiyse sunucu yeni veriyle `200 OK` döner.
:::

## Doğrulama mekanizması: ETag ve 304 Not Modified

Bir verinin süresi dolduğunda tüm içeriği sıfırdan indirmek büyük bir israftır. Sunucu ilk yanıtta verinin parmak izini temsil eden bir **ETag** (Entity Tag) başlığı döner:

```http
HTTP/1.1 200 OK
Content-Type: application/json
Cache-Control: no-cache
ETag: "9a3f-61c8b2"

{ "genres": [{ "id": 28, "name": "Aksiyon" }] }
```

Tarayıcı bu veriyi diske kaydederken `"9a3f-61c8b2"` etiketini de yanına not eder. Kullanıcı sayfayı yeniden ziyaret ettiğinde tarayıcı sunucuya şu koşullu isteği gönderir:

```http
GET /api/genres HTTP/1.1
If-None-Match: "9a3f-61c8b2"
```

Sunucu bakar: Tür listesi değişmemiş! Yeni bir JSON paketi üretip göndermek yerine yalnızca 50 baytlık boş bir başlık paketi döner:

```http
HTTP/1.1 304 Not Modified
ETag: "9a3f-61c8b2"
```

Bu cevabı alan tarayıcı, diskteki mevcut JSON verisini belleğe yükler ve JavaScript'e verir. Kullanıcı güncel veriyi 15 milisaniyede görür ve megabaytlarca transfer tasarruf edilir.

## SPA yayınında altın kural: Hash'li dosyalar vs index.html

Vite ile bir React uygulaması derlediğinde (`vite build`), `dist/` klasöründe iki tür dosya ortaya çıkar:

1. **`index.html`:** Uygulamanın giriş kapısıdır. JavaScript ve CSS dosyalarının adlarını referans verir (`<script src="/assets/index-3f9a1c.js">`).
2. **Varlıklar (`/assets/*.js`, `/assets/*.css`):** Dosya adının içinde içeriğin kriptografik özeti (hash) bulunur (`index-3f9a1c.js`). Kodda tek bir harf değiştiğinde derleyici dosya adını otomatik olarak `index-8b2d4e.js` yapar.

Bu yapı web dünyasının en güçlü önbellek stratejisini doğurur:

| Dosya Türü | Önerilen Cache-Control | Rasyonel |
| --- | --- | --- |
| `/assets/*` (Hash'li dosyalar) | `public, max-age=31536000, immutable` | Dosya adı zaten içeriğin hash'ini taşır. Kod değişirse adı da değişir; bu yüzden eski dosya 1 yıl güvenle önbellekte kalabilir. |
| `index.html` | `no-cache` | Kullanıcı sayfayı her açtığında tarayıcı sunucuya sormalıdır: "Yeni bir deploy var mı?" Yeni deploy varsa sunucu yeni `index.html`'i döner; o da yeni hash'li JS dosyalarını çağırır. |

Bu kuralı bozup `index.html` dosyasına `max-age=31536000` verirsen felaket yaşanır: Yeni bir sürüm yayınladığında kullanıcıların tarayıcısı 1 yıl boyunca eski `index.html`'i kullanır ve yeni özellikleri asla göremez.

## `fetch()` ve önbellek denetimi (`cache` seçeneği)

Tarayıcının yerel `fetch` fonksiyonu, HTTP önbelleğiyle nasıl etkileşime gireceğini belirleyen bir `cache` seçeneğine sahiptir:

```ts check
export async function fetchLiveNewsFeed(category: string): Promise<string[]> {
  const response = await fetch(`https://api.example.test/news?cat=${category}`, {
    // Tarayıcıya önbelleği baypas etmesini ve sunucudan taze veri çekmesini bildir
    cache: 'no-cache',
    headers: {
      Accept: 'application/json',
    },
  })

  if (!response.ok) {
    throw new Error(`Haberler alınamadı: HTTP ${response.status}`)
  }

  const data = (await response.json()) as { headlines: string[] }
  return data.headlines
}
```

Alabileceği temel değerler:
- `'default'`: Standart HTTP önbellek kurallarını işletir (tazeyse önbellekten, bayatsa 304 doğrulaması).
- `'no-store'`: Önbelleğe hiç bakmaz ve cevabı önbelleğe yazmaz.
- `'reload'`: Yerel önbelleğe bakmadan sunucudan taze veri çeker ama cevabı önbelleğe yazar.
- `'no-cache'`: Yerel önbellek taze olsa dahi sunucuya koşullu istek (`If-None-Match`) atarak doğrulatır.
- `'force-cache'`: Bayat olsa bile önbellekte veri varsa onu kullanır.

## Sınır durumları ve sık hatalar

:::mistake[Sık hata: no-cache yönergesini hiçbir şey saklanmasın sanmak]
Belirti → Gizli kullanıcı verisi dönen bir endpoint'e `Cache-Control: no-cache` koyuluyor; fakat veri diske kaydedilmeye devam ediyor.  
Neden → `no-cache`, "saklama" demez; "kullanmadan önce doğrulat" der.  
Düzeltme → Verinin diske veya aracı sunuculara kesinlikle yazılmasını istemiyorsan `Cache-Control: no-store, private` kullan.
:::

:::mistake[Sık hata: index.html dosyasına uzun süreli max-age vermek]
Belirti → Yeni sürüm yayına alındıktan sonra bazı kullanıcıların ekranı beyaz kalıyor ya da eski sürümde takılı kalıyor.  
Neden → Tarayıcı `index.html`'i diskten okuyor ve sunucudan silinmiş olan eski hash'li JavaScript dosyasını aramaya çalışıyor (`404 Not Found`).  
Düzeltme → HTML dosyalarında asla uzun `max-age` kullanma; daima `Cache-Control: no-cache` başlığı gönder.
:::

:::mistake[Sık hata: DevTools "Disable cache" açıkken önbelleği test etmeye çalışmak]
Belirti → Geliştirici Network sekmesinde `304` veya `(disk cache)` görmediğini söyler.  
Neden → DevTools ayarlarında "Disable cache" kutusu işaretlidir; geliştirici araçları açık olduğu sürece tarayıcı tüm önbellek kurallarını askıya alır.  
Düzeltme → Önbellek davranışını test ederken "Disable cache" seçeneğinin işaretini kaldır veya gizli sekmede test yap.
:::

:::sector
Geniş ölçekli e-ticaret ve medya platformlarında CDN (Cloudflare, Fastly, AWS CloudFront) yapılandırması hayati önem taşır. `stale-while-revalidate` deseni sayesinde kullanıcılar anasayfayı 20 milisaniyede açarken, CDN sunucuları arka planda veritabanını yormadan veriyi taze tutar. Bir sonraki modüllerde göreceğin TanStack Query de aynı zihinsel modeli JavaScript belleğine taşır: Veriyi anında göster (`stale`), arkadan sessizce yenile (`refetch`).
:::

## Özet

- HTTP önbelleği (tarayıcı/disk düzeyi) ile uygulama önbelleği (JavaScript belleği) iki ayrı katmandır.
- `max-age` saniye cinsinden tazelik süresidir; bu sürede sunucuya hiç istek gitmez (`disk cache`).
- `no-cache` veriyi saklar ancak her seferinde sunucuya doğrulatır; `no-store` ise hiçbir yere kaydetmez.
- `ETag` ve `If-None-Match` ile doğrulanan içerik değişmediğinde sunucu `304 Not Modified` boş gövde döner.
- SPA mimarisinde hash'li dosyalar 1 yıl (`immutable`), `index.html` ise her zaman doğrulanacak şekilde (`no-cache`) sunulmalıdır.

**Kendini yokla:** `Cache-Control: max-age=600, no-cache` başlığı taşıyan bir yanıtta tarayıcı 5 dakika sonra veriyi doğrudan önbellekten kullanabilir mi?  
*Cevap:* Hayır. `no-cache` yönergesi bulunduğu için tarayıcı her kullanım öncesinde sunucuya doğrulama isteği (`If-None-Match`) atmak zorundadır.

**Kendini yokla:** Neden hash'li JS dosyalarına (`index-a1b2c3.js`) 1 yıl önbellek süresi verilirken `index.html` dosyasına verilemez?  
*Cevap:* Çünkü JS dosyalarının adı içerik değiştikçe değişir, eski dosya çakışmaz. Ancak `index.html`'in adı sabittir; önbelleğe alınırsa kullanıcı yeni JS dosyalarının adını öğrenemez ve güncellemeleri alamaz.
