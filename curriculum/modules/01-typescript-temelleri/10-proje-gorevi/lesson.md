---
title: "Sinema: tipler ve biçimlendirme"
minutes: 6
kind: project
---

# Sinema: tipler ve biçimlendirme

:::pain[Problem]
Sinema'da başlık görünse de gerçek liste verisindeki null poster, boş tarih ve sayfalama alanları ortak bir sözleşmeye bağlanmadı. Bir ekran eksik alanı farklı ele alırsa aynı film uygulamanın başka yerinde bozuk görünür.
:::

## Dış verinin sözleşmesi ve ekrandaki karşılığı

Projede iki küçük ama ortak yüzey kuracaksın: TMDB liste cevabının tipleri ve kullanıcıya gösterilecek tarih/puan metinleri. API tipi dış servisin gönderdiği alanları anlatır; biçimlendirme yardımcıları ise görünümün boş değerleri nasıl sunacağına karar verir. Bu iki katmanı birbirine karıştırma.

:::model[Tipler derleme anında yaşar]
TypeScript tanımı, uygulama kodunu denetler ama JSON cevabını runtime'da doğrulamaz. Projedeki alanları verilen API sözleşmesine göre modelle; ham cevabı doğrulamak gerektiğinde önceki `unknown` dersindeki sınır kontrollerini kullan.
:::

![Tiplerin derleme anında kaldığını ve dış verinin ayrıca ele alınmasını gösteren ortak model](diagram:ts-derleme-ve-calisma)

Tipleri yazarken liste öğesini tek film cevabından ayır. Liste öğesinde tür kimlikleri sayı dizisi olarak gelir; poster ve arka plan görseli `null` olabilir; tarih alanı metindir ama boş gelebilir. Sayfalı cevap ise `results` dizisine ek olarak mevcut sayfa ve toplamları taşır.

Biçimlendirme tarafında her fonksiyonun boş değer sözleşmesini ayrı oku. Puan sıfırsa “oy yok” yazısı, dolu puan için tek ondalık; boş yıl için boş metin; boş uzun tarih için kullanıcıya açıklayıcı metin gerekir. Tarih biçimlendirmesinde saat dilimi seçimi günün kaymasını engeller.

## Uygulama sırası

Önce proje içindeki liste fixture'ını incele ve hangi alanların null olabildiğini not et. Ardından ortak tipi, liste cevabını ve biçimlendirme yardımcılarını tanımla. Her fonksiyonun parametre ve dönüş tipi, başka modüllerin de kullanacağı sözleşmedir; bu yüzden dosya yolu ve named export adlarını görevdeki biçimde tut.

Son olarak sınır örneklerini çalıştır: nullable görsel, boş tarih, sıfır puan, tam sayı puanı ve farklı aylara ait dolu tarihler. Tip kontrolünün geçmesi yalnızca şekillerin uyduğunu gösterir; yuvarlama ve metin biçimini ayrıca gözle doğrula.

:::sector
API tipleri ve biçimlendirme fonksiyonları birden çok ekranın ortak kullandığı küçük sözleşmelerdir. Bunları tek yerde tutmak, kart ile detay sayfasının aynı veriyi farklı yorumlamasını önler.
:::

## Özet

- API cevabının modeli ile görünümdeki metin dönüşümü ayrı sorumluluklardır.
- Nullable alanı ve boş metni farklı gerçekler olarak koru.
- Sabit export sözleşmesi, diğer dosyaların güvenle kullanmasını sağlar.
- Tip kontrolünden sonra davranış sınırlarını da kontrol et.
