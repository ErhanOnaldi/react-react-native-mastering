---
title: "Sınırları sen seç"
minutes: 10
kind: practice
---

# Sınırları sen seç

Bu atölyede önce küçük bir arama davranışını inceleyecek, sonra iki ekranda ortak liste görünümü kuracak, ardından filtre component'inin API'sini seçeceksin. Son çalışma bunların daha geniş bir ürün keşif ekranında nasıl birleştiğini gösterir. Her adımda önce kullanıcı davranışını tarif et, sonra state'in ve kodun sahibini seç.

:::model[State kategorileri]
Değerin nerede yaşaması gerektiğini, kim kullandığına ve ne kadar kalıcı olması gerektiğine göre düşün. Paylaşılabilir arama ve kategori seçimi URL'de; ürün cevabı veri katmanında; panelin açık/kapalı hali geçici UI state'inde durabilir. Liste görünümü ise kendisine verilen filmleri gösterir.
:::

![Server, client, URL ve form state'in sahibini gösteren karar haritas](diagram:state-kategorileri)

:::model[UI ile davranışın sınırı]
Bir component'in görünen işini veri alma ve URL kurma davranışından ayırabilirsin. İki ekran aynı film listesini gösteriyorsa görünüm paylaşılabilir; her ekranın veriyi nereden aldığı ayrı kalabilir. Ortak parça gerçek iki kullanım yerinden çağrılmalı.
:::

## Önce seçimleri ve sonucu eşleştir

İlk küçük örnekte arama metni URL'den gelir. Kullanıcı `/search?q=Matrix&page=2` adresini açtığında input'ta `Matrix`, sonuçta ikinci sayfa görünmelidir. Adres seçimi ile ekrandaki değerler aynı kaynaktan kurulursa yenileme ve geri gezinme tutarlı olur.

Bir sonraki örnekte arama değişir. `Dövüş` yazıldığında yeni arama ilk sayfadan başlamalıdır; çünkü önceki sorgunun örneğin 8. sayfası yeni sorguda anlamlı olmayabilir. URL'deki `q` değişir, `page` 1 olur ve sonuç bu seçime göre yüklenir.

Şimdi geçici bilgi panelini de ekle. URL ile geri/ileri gezinme aramanın seçimini geri kurar, ama `Bilgi` paneli açık kalmak zorunda değildir. Panel geçici UI state'idir; adres ise paylaşılabilir arama seçimini taşır.

| Kullanıcı adımı | URL seçimi | Ekranda beklenen |
|---|---|---|
| `/search?q=Matrix&page=2` açar | `q=Matrix`, `page=2` | Matrix input'u ve ikinci sayfanın filmleri |
| `Dövüş` arar | `q=Dövüş`, `page=1` | İlk sayfadaki eşleşmeler |
| `Bilgi` panelini açıp geri gider | Önceki `q` ve `page` geri gelir | Input ve liste URL ile eşleşir; panel kapanır |

Bu sıra önemlidir: geri gezinmede URL değiştiği anda arama alanı ve sonuç aynı seçime dönmelidir. Bilgi panelini URL'ye koymaman, panel durumunun paylaşılması gerekmediği içindir.

## Görünümü ortaklaştır, veriyi değil

İki ekran da film başlıklarını listeleyebilir: biri popüler filmleri, diğeri arama sonucunu gösterir. Önce aynı görünümü iki ayrı küçük kullanımda düşün; sonra ortak listeyi film dizisi alan bir component yap. Component ortak başlıkları `<li>` içinde gösterir, fakat popüler veya arama verisini kendisi getirmez.

Burada yeni olan paylaşım noktasıdır. Popüler ekran kendi verisini, arama ekranı kendi sorgusunu yönetir; liste görünümü yalnızca aldığı veriyi sunar. Böylece arama alanından popüler ekrana geçerken popüler listenin tekrar çalışması gerekir ve aramanın fetch ayrıntıları ortak UI'ya sızmaz.

## Filtre API'si için bir tercih yap

Tür ve sıralama seçimi gibi iki alanı tek nesneyle de, ayrı kontrollü değerlerle de sunabilirsin. Native combobox, tarayıcının yerleşik açılır seçim kontrolüdür; bu atölyede accessible name'i `Tür` ve `Sıralama` olan seçimler bu işi yapar. Kullanıcı seçimini görmeli ve tek bir `Sıfırla` eylemi varsayılan iki değere döndürmelidir.

API seçimini yalnızca kod stili diye açıklama. Seçimler birlikte güncelleniyorsa tek değer grubu anlamlı olabilir; alanların bağımsız kullanımı daha açıksa ayrı props'lar okunaklı olabilir. Seçim yapmak tek başına ağ isteği gerektirmez; API tasarımının gerekçesi kullanım yerinde anlaşılır olmalı.

:::mistake[Arama ile paneli aynı state'e koymak]
**Belirti →** Geri düğmesiyle arama düzeliyor ama bilgi paneli de beklenmedik biçimde açık kalıyor ya da arama seçimleri kayboluyor. **Neden →** URL'de saklanması gereken seçimle geçici görünüm durumu aynı yerde ele alınmış. **Düzeltme →** Arama/kategori gibi geri kurulacak seçimleri URL'den oku; panel görünürlüğünü geçici UI state'i olarak yönet.
:::

## Ürün keşfine ilerle

Son çalışma, `projects/atolye` kopyasında gerçek ürün kayıtlarıyla arama, kategori, detay ve listeye dönüşü birleştirir. DummyJSON, bu örnekte ürün ve kategori verisi sunan demo API'dir. `router loader`, React Router'ın bir route açılırken o ekranın verisini yüklemesini sağlayan fonksiyondur; route verisini component'ten önce hazırlamak için kullanılabilir.

Kullanıcı `beauty` kategorisini seçip ürünü açtığında listeye dönünce arama ve kategori seçimi korunmalı. Bekleme, boş sonuç ve servis hatası da görünür ve erişilebilir olmalı. Önce state'in sahibini çiz; sonra feature dosyalarını düzenle, ortak API işini UI'dan ayır ve çalışan akışı tarayıcıda dene.

Atölyeye başlamak için repo kökünde sırayla `pnpm setup:projects atolye` ve `pnpm install` çalıştır; sonra `projects/atolye` içinde `pnpm dev` ile uygulamayı aç. Son ekranda arama/kategori seç, detaya gir ve geri dön. Seçimlerin korunup korunmadığını, boş ve hata hallerinin anlaşılır olup olmadığını kontrol et. Bitince görev sayfasındaki AI review prompt'unu kopyalayıp rubric üzerinden inceleme al.

## Özet

- Paylaşılabilir arama ve kategori seçimleri URL'den geri kurulmalı.
- Tekrarlanan liste görünümü paylaşılabilir; veriyi getirme davranışı ekranlara ait kalır.
- Component API kararını kullanım yerindeki bakım kolaylığıyla açıkla.
- Ürün keşif akışında bekleme, boş sonuç, hata, detay ve geri dönüşü birlikte kontrol et.

**Yeni terimler:** `Native combobox`: Tarayıcının yerleşik açılır seçim kontrolü. `Router loader`: Route açılırken o ekranın verisini hazırlayan React Router fonksiyonu. `DummyJSON`: Alıştırmada ürün verisi sunan demo API.

**Kendini yokla:** Arama metni URL'de, bilgi paneli ise geçici state'te neden durur?
*Cevap:* Arama paylaşılmalı ve geri gezinmeyle kurulmalı; panelin görünürlüğü yalnızca anlık arayüz tercihidir.

**Kendini yokla:** İki ekran aynı liste görünümünü kullanıyorsa veri alma işini de liste component'ine koymalı mısın?
*Cevap:* Hayır. Liste ortak görünümü sunabilir; her ekran kendi verisini hazırlayıp listeye verir.
