---
title: "Sinema arama akışını pekiştir"
minutes: 5
kind: practice
---

# Arama davranışını birlikte düşün

Bu bölümde önceki derslerde öğrendiğin kullanıcı etkileşimi testini ve MSW handler’ını aynı Sinema arama akışında kullanacaksın. Birinde ekranda görünen farklı durumları sınayacak, diğerinde arama metninin hangi filmleri döndürdüğünü belirleyeceksin.

:::model[Test anatomisi]
Bir testte kullanıcı davranışını başlat, ardından kullanıcının görebildiği sonucu doğrula. Ağ cevabını MSW ile kontrol ettiğinde uygulamanın gerçek `fetch` akışı çalışır; yalnızca sunucudan gelen cevap değişir. İstek ayrıntısı, ekrandaki sonucun yerine geçmez.
:::

İlk çalışmada akışı kullanıcının gözünden sırala: arama alanını bul, metni gönder, önce yüklenme durumunu, sonra sonucu izle. Başarı, boş liste ve hata ayrı kullanıcı durumlarıdır; her birinde ekranda neyin değiştiğini düşün. Sonuçları beklerken sabit süre tahmin etmek yerine asenkron sorguları kullan.

İkinci çalışmada aynı arama fikrini HTTP sınırında ele alacaksın. Handler, gelen query’yi okuyup film listesini ona göre cevaplar. Baş/son boşluk, harf büyüklüğü ve boş query gibi küçük farkların sonuçta ne değiştirmesi gerektiğini önce örneklerle belirle.

Takılırsan önce her testin kanıtlamak istediği tek davranışı bir cümleyle yaz. Sonra kullanıcı adımını, handler cevabını ve görünür sonucu sırayla eşleştir. Yeşil testin yalnız isteğin atıldığını değil, doğru davranışın ekrana ulaştığını da gösterdiğinden emin ol.

## Hatırlayacağın noktalar

- Kullanıcı etkileşimini `user-event` ile başlat ve Promise’ini bekle.
- Asenkron sonucu görünür olduğunda doğrula; duvar saati tahmini yapma.
- MSW cevabı ve DOM’da görünen sonuç farklı kanıtlardır.
- Başarı, boş sonuç ve hata akışlarını ayrı ayrı düşün.
