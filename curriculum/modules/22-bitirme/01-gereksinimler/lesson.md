---
title: "Gereksinimler: “bitti” ne demek?"
minutes: 7
kind: project
---

# Gereksinimler: “bitti” ne demek?

Kitaplık fikri basit: kitap ara, ayrıntısına bak ve okuma listeni tut. Ama “arama hızlı olsun” ya da “liste kaybolmasın” cümleleri tek başına bitiş çizgisini anlatmaz. Bir gereksinim, uygulamayı deneyen iki kişinin aynı sonucu görüp görmediğini kontrol edebileceğin kadar açık olmalı.

:::model[Kabul kriteri]
Kabul kriteri, bir özelliğin tamam sayılması için gözlenebilir koşuldur. “Arama kolay olsun” yerine “boş sorguda istek atılmaz ve kullanıcıya arama ipucu gösterilir” dediğinde hem davranışı hem doğrulama yolunu anlayabilirsin.
:::

## Belirsiz isteği kontrol edilebilir yap

Önce istek cümlesini, sonra beklenen davranışı yaz. Örneğin Kitaplık’ta “kitap arayabilmeliyim” isteği tek başına yeterli değil. Formu gönderdiğinde adresin aramayı taşıması ve aynı adres yenilendiğinde aramanın korunması gibi ayrı gözlemler düşün.

```text
Diyelim ki arama kutusunda “Dune” yazıyor,
Ara’ya bastığımda,
adres /search?q=Dune olur ve sonuç listesi görünür.
```

Burada üç bölüm var: başlangıç durumu, kullanıcının yaptığı şey ve görülecek sonuç. Her kriteri bu biçimde yazmak zorunda değilsin; biçim, belirsiz cümleyi açmana yardım eder.

![Gereksinim, hazırlık ve çalıştırmadan geçerek doğrulanabilir bir teste dönüşür](diagram:test-anatomisi)

Ardından bir küçük ekleme yap: boş sorguyu düşün. `q` yoksa veya boşsa ağ isteği çıkmamalı; ekranda ne göreceğini ayrıca yaz. Bu, “arama başarısız” ile kullanıcının henüz arama yapmamış olmasını birbirinden ayırır.

Son olarak gerçek veri sınırlarını ekle. Open Library bir kitabın kapağını göndermeyebilir; böyle bir durumda kırık resim yerine kapak yer tutucusu beklenir. Yazar isteği 404 dönerse eser başlığı görünmeye devam etmeli; çünkü yazar bilgisi eserin kendisinden ayrı bir istektir.

## Güvenlik ve yayın koşulları

**XSS**, saldırgan metnin sayfada kod gibi çalıştırılmasıdır; örneğin dış API’den gelen bir açıklamayı ham HTML olarak eklemek buna yol açabilir. Kitaplık metni normal React metin çıktısı olarak göstermeli, kontrolsüz HTML eklememelidir. Dış bağlantılar da `rel="noreferrer"` ile açılmalıdır.

Üç yayın terimini de gereksinime dönüştür:

- **SPA fallback:** Tek sayfalı uygulamanın sunucusu `/works/OL...` gibi doğrudan açılan yolları uygulamanın `index.html` dosyasına yönlendirir. Yoksa yenilemede uygulama yerine sunucunun 404 sayfası gelir.
- **Cache başlıkları:** Tarayıcıya dosyanın ne kadar saklanacağını söyler. İçinde hash olan değişmez JS/CSS uzun süre saklanabilir; `index.html` ise yeni sürüm duyurularını kaçırmamak için yeniden kontrol edilmelidir.
- **ErrorBoundary:** React arayüzünde render sırasında oluşan beklenmedik hatayı yakalayıp tüm ekranın boş kalması yerine yedek bir hata görünümü gösteren sınırdır.

Bu ayrıntılar dağıtım kararıdır; kabul kriterlerinde neyin doğrulanacağını yaz, uygulama yöntemini sonraki mimari belgede seç. Güvenlik gereksiniminde de kullanıcı davranışını tanımla, çözüm kütüphanesini şart koşma.

:::mistake[“Bulunamadı”yı tek duruma indirmek]
Belirti: boş arama ve olmayan eser aynı mesajı gösterir. Neden: “sonuç yok” ile sunucudan 404 dönen eser birbirine karışmıştır. Düzeltme: boş aramada sonuç olmadığını, eser 404’ünde ise “Kitap bulunamadı” gösterileceğini ayrı kriter yap.
:::

## Çalışma sırası

Önce kullanıcıyı ve faydayı iki cümlede tarif et. Sonra kullanıcı hikâyelerini ve ölçülebilir kabul kriterlerini yaz; API’de eksik kapak, yazar hatası ve açıklamanın farklı biçimlerde gelmesi gibi durumları incele. En son erişilebilirlik, gizlilik, API nezaketi, güvenlik, yayın koşulları ve v1 kapsam dışını ekle. Kriter cümlesinde Redux, Context veya hook seçme: bunlar “nasıl” sorusudur ve mimari karar belgesine aittir.

## Özet

- Gereksinim, ürünün ne yapacağını ve nedenini anlatır; uygulama aracını seçmez.
- Kabul kriteri gözlenebilir olmalı; boş arama ile bulunamayan eser farklı durumlardır.
- XSS, SPA fallback, cache başlıkları ve ErrorBoundary güvenlik/yayın davranışlarını netleştirir.
- Gerçek API yanıtlarındaki eksik alanlar için beklenen güvenli davranışı yaz.

**Yeni terimler:** Kabul kriteri: özelliğin tamam sayılacağı gözlenebilir koşul. XSS: metnin kod gibi çalıştırılmasıyla oluşan saldırı. SPA fallback: derin adresleri uygulamanın giriş sayfasına yönlendirme. Cache başlığı: tarayıcı önbelleğinin saklama davranışını belirten HTTP bilgisi. ErrorBoundary: React render hatasında yedek arayüz gösteren sınır.

### Kendini yokla

1. “Arama güzel çalışmalı” neden test edilebilir değildir? **Cevap:** Beklenen görünür davranış belli değildir; ölçülebilir bir sonuç yazmalısın.
2. Aramada sonuç olmaması ile eser 404’ü neden ayrı yazılır? **Cevap:** Biri arama yanıtında eşleşme bulunmamasıdır, diğeri istenen tekil eserin sunucuda bulunmamasıdır.
