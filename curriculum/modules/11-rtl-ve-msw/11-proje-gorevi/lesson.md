---
title: "Sinema için test altyapısı kur"
minutes: 5
kind: project
---

# Sinema’nın test ortamını ve sayfa testlerini tamamla

Bu proje, modülde öğrendiğin RTL ve MSW parçalarını Sinema’da bir araya getiriyor. Önce her testin kullanabileceği ortak ağ ve router kurulumunu oluşturacak, ardından arama ve film detay sayfalarının kullanıcıya görünen davranışlarını sınayacaksın.

:::model[MSW perdesi]
Uygulamanın HTTP isteği kendi kodundan çıkar; MSW bu isteği testte karşılayıp kontrollü bir cevap verir. Böylece arayüzün gerçek istek akışı çalışırken test, dış servise ve değişken internet bağlantısına bağlı kalmaz. Handler cevabı API’nin beklediği biçimde tut.
:::

:::model[Test anatomisi]
Testi kullanıcı adımıyla başlat ve ekranda oluşan sonucu doğrula. Router kullanıldığında başlangıç URL’i hangi sayfanın açıldığını belirler; ortak render helper’ı bu başlangıcı tekrar tekrar kurmayı kolaylaştırır.
:::

Önce ortak altyapının üç sorumluluğunu ayır: test başlamadan ve bittikten sonra çalışan lifecycle, varsayılan API handler’ları ve URL ile render eden router helper’ı. Her parça ortak kurulumu sağlar; tek bir senaryonun özel cevabını testin içinde seçersin.

Sonra sayfaları kullanıcı davranışı açısından ele al. Arama için URL’deki query’yi, kullanıcının yazmasını ve ekranda beliren sonucu birlikte düşün. Detay sayfasında başlangıç adresi bir film kimliği taşır; bulunan ve bulunmayan film farklı görünür durumlar üretmelidir. Her test kendi başlangıç adresiyle ve kendi senaryosuyla anlaşılır kalsın.

Çalışmaya başlamadan önce mevcut dosya yollarını ve export adlarını oku; projedeki Router ve Vite ayarlarını koru. Önce ortak kurulumu ayağa kaldır, sonra sayfaları başarı ve sınır durumlarında incele. Bir hata ararken kullanıcı adımından handler cevabına, oradan DOM’daki sonuca kadar akışı takip et.

## Hatırlayacağın noktalar

- Ortak test kurulumu, tekrar eden ortam işini üstlenir; senaryoya özgü cevap testte kalır.
- Gerçek ağa çıkmadan HTTP cevabını MSW ile kontrol edebilirsin.
- Başlangıç URL’i ve kullanıcı adımları sayfanın hangi davranışını gördüğünü belirler.
- Test, isteği değil kullanıcının gördüğü sonucu da doğrulamalı.
