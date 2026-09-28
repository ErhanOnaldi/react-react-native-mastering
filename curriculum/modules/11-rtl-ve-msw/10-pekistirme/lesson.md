---
title: "Arama akışını uçtan uca bileşen sınırında birleştir"
minutes: 6
kind: practice
---

# Arama akışını bileşen sınırında birleştir

:::pain[Problem]
Arama testi yalnızca bir HTTP çağrısı gördüğünü doğruluyor. Boş sonuç yanlış mesaj gösterse, 500 ekranı yüklemede kalsa bile test yeşil. Kullanıcının gerçekten gördüğü yol hâlâ korunmuyor.
:::

:::model[Test anatomisi]
Hazırla, kullanıcı davranışını çalıştır ve görünür sonucu doğrula. Bu pekiştirmede component, etkileşim ve MSW aynı entegrasyon testinde buluşur. Yeni soru, API cevabının arama metnine göre doğru sonuca dönüşmesini ayrı bir handler sınırında ele alır.
:::

## Her senaryonun kanıtını seç

Başarılı arama, boş liste ve sunucu hatası birbirinden farklı ürün durumlarıdır. Bir akışta kullanıcı metni yazar, aramayı başlatır ve sonuca ulaşır. Testin yalnız istek yapıldığını değil, doğru başlık veya mesajın ekranda göründüğünü de göstermesi gerekir. Loading durumunu gözlemek için response’u kontrollü biçimde geciktir; duvar saati tahminine bağlanma.

İkinci çalışma, handler cevabını istek query’sine bağlar. Bu katmanda `Matrix` isteğinin `Matrix` eşleşmesi üretmesi, boş query’nin sonuçsuz kalması beklenir. Başarı ve sınır durumlarını aynı senaryoya yığma; her test bir davranışı anlaşılır biçimde anlatmalı.

## Çalışma sırası

1. Testte rol/ad sorgusuyla arama alanını ve eylem kontrolünü bul.
2. `user-event` ile arama akışını çalıştır; etkileşim Promise’lerini bekle.
3. Handler’ı ilgili teste özgü response için kur; ortak varsayılan cevabı değiştirme.
4. Loading, başlık, boş durum veya hata gibi kullanıcıya görünen kanıtı seç.
5. Gerekliyse istek query’sini ayrıca doğrula; bu assertion DOM sonucunun yerine geçmez.

Bir assertion başarısızsa önce beklenen/gelen değerleri ve handler eşleşmesini karşılaştır. Testin gerçekten kullanıcı davranışını başlatıp başlatmadığına, query’nin endpoint’e ulaşıp ulaşmadığına ve status’un uygulama state’ine çevrilip çevrilmediğine bak. Test verisini response formatına uydurmak için uygulama gereksinimini sessizce daraltma.

:::sector
Takımlar arama gibi kritik akışlarda başarı, boş ve hata durumlarını ayrı senaryolarda tutar. Böylece bir ürün hatası çıktığında hangi kullanıcı durumunun bozulduğu hızlıca anlaşılır.
:::

## Özet

- Arama etkileşimini kullanıcı gibi başlat.
- MSW ile response senaryosunu değiştir, uygulama fetch’ini mock’lama.
- DOM sonucu ve request ayrıntısı farklı kanıtlar sağlar.
- Başarı, boş ve hata durumlarını ayrı testlerle görünür kıl.
