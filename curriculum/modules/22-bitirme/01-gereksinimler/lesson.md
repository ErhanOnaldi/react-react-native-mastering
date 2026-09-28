---
title: "Gereksinimler: “bitti” ne demek?"
minutes: 11
kind: project
---

# Gereksinimler: “bitti” ne demek?

:::pain[Problem]
Sinema projesini geliştirirken acı günlüğün (`NOTES.md`) beklenmedik sürprizlerle dolmuştu: *Arama kutusu boşken ne olacak? Posteri olmayan filmde kırık resim mi görünecek? Olmayan bir film kimliği açılınca sayfa çökecek mi?* Bu soruların cevabını kodu yazarken, tek tek **hata olarak** keşfettin.

Sorun kod yazma yeteneğinde değildi: “bitti” kelimesinin ne anlama geldiği ve sınır durumlarında ne beklendiği baştan yazılmamıştı. Tanımı net olmayan bir işi ne güvenle bitirebilirsin ne de doğru test edebilirsin.
:::

Bu derste henüz tek satır kod yazmıyorsun. Müşterinin belirsiz isteğini, ekipteki herkesin aynı şekilde anladığı, kenar durumlarını, güvenlik sınırlarını ve yayına hazırlık şartlarını içeren **test edilebilir** bir belgeye çeviriyorsun: `REQUIREMENTS.md`.

## Müşteriden gelen mesaj

Bir sabah ürün sahibinden şu mesajı aldın:

> “Kitap okumayı seviyorum ama neyi okuduğumu, neyi okumak istediğimi hep unutuyorum. Bir kitabı arayıp detayına bakabileceğim, ‘okumak istiyorum / okuyorum / okudum’ diye işaretleyip kısa not düşebileceğim sade bir uygulama istiyorum. Open Library’nin ücretsiz bir API’si var, anahtar da istemiyor. Telefonda da rahat açılsın. Hesap, giriş falan istemem; bu tarayıcıda kalsın yeter.”

Bu mesaj iyi bir başlangıçtır ancak içinde tek bir ölçülebilir cümle yoktur. “Sade” ne kadar sade? “Rahat açılsın” neyle ölçülür? Arama kutusuna her harf yazıldığında istek atılacak mı? Güvenlik nasıl sağlanacak?

## Belirsizden ölçülebilire dönüşüm

İyi bir gereksinim **doğru ya da yanlış** diye nesnel olarak kontrol edilebilir. Kontrol edemediğin bir iddiaya otomatik test yazamazsın.

| Belirsiz talep | Ölçülebilir kabul kriteri | Doğrulama yöntemi |
| --- | --- | --- |
| “Arama hızlı olsun.” | Aynı arama ve sayfa için 5 dakika içinde tekrar açıldığında **ağdan yeni istek atılmaz**, önbellekten sunulur. | Ağ istek sayacı kontrolü |
| “Kullanıcı dostu hata mesajı.” | Sunucu hatasında `role="alert"` içeren bir uyarı ve **“Tekrar dene”** butonu görünür; butona basınca istek yinelenir. | RTL rol ve metin sorgusu |
| “Liste kaybolmasın.” | Liste `localStorage` üzerinde saklanır; sayfa yenilenince geri gelir; bozuk JSON kaydı uygulamayı çökertmez. | Depolama okuma ve hata testi |
| “Sayfalama olsun.” | Sayfa başına 10 sonuç; “Sayfa 2 / 5” metni; ilk sayfada “Önceki”, son sayfada “Sonraki” pasif (`aria-disabled="true"`). | UI etkileşim testi |
| “Uygulama güvenli olsun.” | Dış API'den gelen veya kullanıcının girdiği metinler asla ham HTML olarak yorumlanmaz; dış bağlantılarda `rel="noreferrer"` bulunur; kodda sır saklanmaz. | Güvenlik statik analizi |

## Kabul kriterleri ve test bağlantısı

Sektörde iş gereksinimleri genellikle iki temel parçayla ifade edilir:

1. **Kullanıcı hikâyesi:** Kim, ne istiyor ve *neden*?
   > **Kullanıcı olarak** kitap adı ya da yazarla arama yapmak istiyorum, **çünkü** ilgilendiğim kitabı hızla bulmak istiyorum.
2. **Kabul kriterleri:** Hikâyenin tamamlanmış sayılması için doğrulanması gereken koşullar. En kesin format **Given / When / Then** (Diyelim ki / ... yaptığımda / ... görürüm) yapısıdır:

```text
K-5  Diyelim ki arama kutusu boş veya yalnızca boşluklardan oluşuyor,
     Kullanıcı "Ara" butonuna bastığında,
     Ağ üzerinden hiçbir istek atılmaz ve mevcut arayüz/URL değişmez.
```

Bu ifade doğrudan çalıştırılabilir bir test cümlesine dönüşür: `it('boş ya da sadece boşluk içeren aramada istek atmaz', ...)`.

![Gereksinimden teste giden doğrulama adımları](diagram:test-anatomisi)

## API verisini önceden keşfetmek

Gereksinimleri varsayımlarla yazamazsın; önce entegre olacağın API’nin gerçekte ne döndürdüğünü incelemelisin. Open Library anahtar istemediği için uç noktaları terminalde doğrudan deneyebilirsin:

```bash
curl 'https://openlibrary.org/search.json?q=dune&limit=2&fields=key,title,author_name,first_publish_year,cover_i'
curl 'https://openlibrary.org/works/OL893414W.json'
curl 'https://openlibrary.org/authors/OL79034A.json'
```

Bu çağrılar sana belgende mutlaka yer alması gereken şu **kenar durumlarını** gösterir:

- Bazı kitaplarda `cover_i` alanı tanımsızdır veya eser kaydındaki `covers` dizisinde "kapak yok" anlamında `-1` döner. Kırık resim göstermek yerine nötr bir yer tutucu gösterilmelidir.
- `author_name` eksik olabilir ya da Kiril alfabesi gibi farklı alfabelerle gelebilir.
- Eserin `description` alanı bazen düz metin, bazen `{ "type": "/type/text", "value": "..." }` nesnesi olarak gelir. UI bu iki biçimi de zarifçe karşılamalıdır.
- Eser kaydında yazarın adı doğrudan yer almaz; yalnızca yazar anahtarı (`/authors/OL79034A`) bulunur. Bu ikinci istek 404 dönerse bile ana eser ekranı çökmeyip "Yazar bilinmiyor" demelidir.
- `numFound` değeri 48.000 gibi yüksek sayılara ulaşabilir. Sayfa sayısını istemci tarafında formülle hesaplaman gerekir (`Math.ceil(total / 10)`).

## Sabit sözleşme kuralları

Gerçek hayatta projeye başladığında bazı sınırlar tasarım sistemi veya altyapı ekibi tarafından önceden kararlaştırılmıştır. Kitaplık için de aşağıdaki sözleşme maddeleri sabittir:

| Konu | Karar ve kural |
| --- | --- |
| Adresler | `/` (ana sayfa), `/search?q=dune&page=2` (arama), `/works/OL893414W` (eser detayı), `/reading-list?status=read` (okuma listesi; durumlar: `want`, `reading`, `read`), diğer tüm yollar için "Sayfa bulunamadı". |
| Arama akışı | Arama metin kutusuna yazarken değil, form gönderilince (Enter veya "Ara" butonu) yapılır. Sayfa başına **10** sonuç listelenir. |
| Detay ve kapak | Eser için `GET /works/{id}.json`, yazar için `GET /authors/{id}.json`. Kapaklar: `https://covers.openlibrary.org/b/id/{cover_id}-M.jpg`. |
| Okuma listesi | Tarayıcıda yerel saklanır; `localStorage` anahtarı **`kitaplik:reading-list`** olarak kullanılır. |
| Arayüz metinleri | Başlık **Kitaplık** · arama etiketi **Kitap ara**, buton **Ara** · **Önceki / Sonraki**, **Sayfa 2 / 5** · **Tekrar dene** · **Yazar bilinmiyor** · **Açıklama yok.** · **Kitap bulunamadı** · menüde **Okuma listem (n)**. |

## Güvenlik ve yayına hazırlık kriterleri

Gereksinim belgesi sadece mutlu kullanıcı yolunu değil, savunma ve dağıtım gereksinimlerini de açıkça tanımlamalıdır:

1. **Güvenlik kriterleri:**
   - **XSS önleme:** Dış API'den gelen kitap açıklamaları veya kullanıcı notları kesinlikle `dangerouslySetInnerHTML` veya kontrolsüz DOM manipülasyonu ile ekrana basılamaz. React'in varsayılan metin kaçışlama mekanizmasına güvenilmelidir.
   - **Güvenli dış bağlantılar:** Open Library veya kaynak sayfalarına verilen tüm dış linklerde `rel="noreferrer"` (veya `rel="noopener noreferrer"`) özniteliği zorunludur.
   - **Sır saklama:** İstemci tarafı kodunda ve Vite bundle'ında hiçbir özel gizli anahtar veya yetkili API parolası saklanamaz.

2. **Yayına hazırlık kriterleri:**
   - **SPA fallback:** Statik barındırma sunucusunda tüm derin yolların (`/search`, `/works/:id`, `/reading-list`) `index.html` dosyasına yönlenmesi şarttır.
   - **Cache başlıkları:** Vite tarafından üretilen hash'li varlıklar (`/assets/*.js`, `*.css`) için uzun süreli değişmez cache (`max-age=31536000, immutable`), kök `index.html` için ise her ziyarette tazelik denetimi yapan `no-cache` kuralı belgelenmelidir.
   - **Hata raporlama:** Çalışma zamanında yakalanmayan beklenmedik hatalar arayüzü beyaz ekrana boğmamalı; bir hata sınırı (ErrorBoundary) ile yakalanıp konsola veya izleme servisine bildirilmelidir.

:::mistake[Gereksinime mimari çözüm yazmak]
**Belirti:** Gereksinim belgesinde “Okuma listesi Redux Toolkit ile tutulacak” veya “Veri çekmek için TanStack Query kullanılacak” ifadelerinin yer alması.  
**Neden:** Gereksinim *ne* yapılacağını ve *neden* istendiğini anlatır; *nasıl* yapılacağı mimari kararların (ADR) konusudur.  
**Düzeltme:** Kütüphane isimlerini belgeden çıkar; işlevsel davranışı yaz: “Okuma listesi tarayıcıda kalıcı olarak saklanır, sayfa yenilendiğinde veriler korunur.”
:::

:::sector[Sektörde gereksinim ve Definition of Done]
Yazılım ekiplerinde bu belge PRD (*Product Requirements Document*), ürün şartnamesi veya Jira Epic'leri şeklinde yaşar. Bir özelliğin kodlanması bitmeden önce "Bitti Tanımı" (*Definition of Done - DoD*) devreye girer: "Tüm kabul kriterleri otomatik testlerle kanıtlandı, güvenlik kontrolleri geçti, linter ve tip kontrolü sıfır hatayla tamamlandı, CI hattı yeşil yandı."
:::

## Özet

- Gereksinim belgesi (`REQUIREMENTS.md`), belirsiz ürün isteklerini ölçülebilir ve test edilebilir kriterlere dönüştürür.
- Kabul kriterleri *Given / When / Then* yapısıyla yazıldığında doğrudan test senaryolarına kaynaklık eder.
- API'nin gerçek yanıtları curl ile incelenmeli; eksik kapak, kayıp yazar ve farklı açıklama formatları gibi kenar durumları baştan tanımlanmalıdır.
- Güvenlik (XSS koruması, güvenli bağlantılar, sırsız mimari) ve yayına hazırlık (SPA fallback, cache politikası) gereksinim belgesinin ayrılmaz parçasıdır.

### Kendini yokla

1. **Soru:** “Arama sayfası hızlı ve kullanıcı dostu olmalı” cümlesi neden kötü bir kabul kriteridir?  
   **Cevap:** Çünkü “hızlı” ve “kullanıcı dostu” ifadeleri kişiseldir ve ölçülemez. Otomatik bir test bu cümleyi doğrulayamaz. Bunun yerine "Arama sonuçları 10'lu sayfalarda sunulur, hata durumunda Tekrar dene butonu görünür" gibi ikili (doğru/yanlış) doğrulanabilir kurallar yazılmalıdır.
2. **Soru:** Güvenlik ve yayına hazırlık maddeleri neden kodlama bittikten sonra değil de gereksinim aşamasında belgelenir?  
   **Cevap:** SPA yönlendirmesi veya XSS kaçışlaması sonradan akla gelirse mimariyi ve test kurgusunu baştan değiştirmek gerekir. Erken tanımlamak, hem test stratejisini hem de dağıtım yapılandırmasını en baştan sağlam kurmayı sağlar.
