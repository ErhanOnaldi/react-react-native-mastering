---
title: "Proje görevi: Sinema'yı canlı veriye bağla"
minutes: 6
kind: project
---

# Sinema'yı canlı veriye bağla

Sinema'da artık örnek film listeleri yerine TMDB'den gelen verilerle çalışacaksın. Beş adımda ortak bir istek yardımcısı kurup ana sayfa, arama, detaylar, favoriler ve tür filtresini canlı veriye bağlayacaksın. Her adımda uygulamayı tarayıcıda aç; bir şey beklediğin gibi görünmüyorsa önce URL'yi, sonra Network sekmesindeki isteği ve cevabı incele.

:::model[HTTP istek/cevap]
Bir `fetch` çağrısı istek gönderir, sonra bir `Response` verir. `fetch` 4xx veya 5xx durumlarında kendiliğinden hata fırlatmadığı için `response.ok` değerini sen denetlersin; başarılı cevabın gövdesini de yalnızca bir kez okursun. Bu sırayı ortak istek yardımcısında hatırla.
:::

:::model[HTTP önbellek kararı]
Tarayıcı cevabı yeniden kullanabilir ya da sunucuya yeniden doğrulatabilir; karar cevabın HTTP cache başlıklarına bağlıdır. Bu çalışma sırasında uygulama verisini ayrıca saklayan bir katman kurmuyorsun; mevcut istek ve ekran davranışını gözlemliyorsun.
:::

İlerlerken URL'deki arama, tür ve sayfa değerlerini ekranın kaynağı olarak kullan. Böylece aynı adresi açan ya da yenileyen kişi aynı görünümü elde eder. `role="status"`, yükleme gibi geçici bir bilgiyi ekran okuyucuya duyuran roldür; `role="alert"` ise önemli ve hemen duyurulması gereken hata mesajları içindir.

İşleri küçük tut: önce ortak istek yardımcısını tamamla, sonra her sayfayı sırayla canlı veriye geçir. Her adımdan sonra bir başarı durumunu, bir yükleme veya hata durumunu elle dene. Eksik afiş ya da boş sonuç gibi geçerli durumları da düşün; arayüz yalnızca dolu ve sorunsuz cevaplarda çalışmamalı.

## Özet

- Ortak yardımcıda istek adresi, Türkçe tercih, yetkilendirme ve HTTP hata kontrolü tek yerde buluşur.
- Sayfaları sırayla canlı veriye geçir; URL değerlerini arama, tür ve sayfa görünümünün kaynağı olarak kullan.
- Network sekmesinde isteği ve cevabı, arayüzde yükleniyor/hata/boş durumlarını birlikte gözle.
- `status`: geçici durum bilgisini duyurur. `alert`: hemen duyurulması gereken önemli mesajı belirtir.

### Kendini yokla

**`fetch` 500 durumunda neden `response.ok` kontrolü gerekir?**  
Çünkü HTTP hatası `fetch` Promise'ini otomatik olarak reddetmez; uygulamanın başarısız cevabı kendisinin ele alması gerekir.

**Arama ve türü yalnızca bileşen state'inde tutmak neden yetersiz kalabilir?**  
URL'de olmazlarsa sayfa yenilendiğinde veya adres paylaşıldığında aynı görünüm yeniden kurulamaz.
