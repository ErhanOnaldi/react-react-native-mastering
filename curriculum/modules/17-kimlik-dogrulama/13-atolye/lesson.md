---
title: "Oturum ve hata akışı"
minutes: 7
kind: practice
---

# Oturum ve hata akışı

:::pain[Arayüzde takılan oturumlar ve gizemli hatalar]
Kullanıcı giriş yapıp sayfayı yenilediğinde profil yüklenmiyor ve giriş formunda takılı kalıyor. Bir başka senaryoda oturum süresi dolan kullanıcı "Profili yenile" butonuna bastığında ekran sonsuza dek "Yükleniyor" durumunda asılı kalıyor. Yanlış şifre girildiğinde ise ya hata mesajı hiç okunmuyor ya da kullanıcının yazdığı uzun kullanıcı adı silinip gidiyor. Kullanıcıların güvenini en çok sarsan hatalar, oturum ve kimlik akışındaki bu pürüzlerdir.
:::

## Bağımsız atölye deneyimi

Bu Atölye çalışmasında, kimlik doğrulama akışlarında sıkça karşılaşılan üç kritik belirtiyi bağımsız bir mühendis gibi teşhis edip çözeceksin. 

Atölye görevleri, önceki derslerdeki rehberli adımlardan farklı olarak **daha az yönlendirme** içerir:
- Sana hangi hook'u, hangi state yapısını veya hangi yardımcı kütüphaneyi kullanacağın söylenmez.
- Yalnızca kullanıcının karşılaştığı **belirti**, beklenen **iş gereksinimi** ve testlerin bağlandığı **giriş noktası** (public entry point) verilir.
- Çözüm mimarisi tamamen senin kararına bırakılmıştır.

Çalışırken bir noktada takılırsan, her sorudaki ipuçlarını sırayla açabilirsin:
1. **1. Kademe (Yön):** Hangi yaşam döngüsü adımına veya duruma bakman gerektiğini hatırlatır.
2. **2. Kademe (Yöntem):** İlgili React veya JavaScript yöntemini önerir.
3. **3. Kademe (İskelet):** Takıldığın düğümü çözecek kısa bir kod örneği sunar.

## Atölye görevlerinin odak alanları

Atölyede çözeceğin üç zorlu senaryo:

### 1. Oturum Dönüşü (`01-oturum-donusu`)
Kullanıcı normal şekilde giriş yaptığında profil görüntüleniyor; ancak tarayıcıda zaten geçerli bir oturum jetonu varken (örneğin sayfa yenilendiğinde) ekran profile ulaşamıyor ve ağ günlüğünde mükerrer istekler fırlıyor. Bileşenin başlangıç durumunu ve yaşam döngüsü etkilerini denetleyerek oturumun tek bir istekle sorunsuz açılmasını sağlayacaksın.

### 2. Süresi Dolan Oturum (`02-suresi-dolan-oturum`)
Oturum süresi dolduğunda profil yenileme eyleminin kilitlenmesini engelleyecek, arka plandaki yenileme akışını onaracaksın. Ayrıca hatalı bir denemenin ardından doğru bilgilerle tekrar denendiğinde eski hata mesajlarının ekranda asılı kalmasını önleyeceksin.

### 3. Giriş Hatası ve Düzeltme (`03-giris-hatasi-ve-duzeltme`)
Kullanıcı dostu, erişilebilir bir giriş paneli inşa edeceksin. Hatalı denemede kullanıcı adını koruyacak, `role="alert"` ile hatayı duyuracak ve işlem sürerken mükerrer tıklamaların ek ağ isteği üretmesini engelleyeceksin.
