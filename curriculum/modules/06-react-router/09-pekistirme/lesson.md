---
title: "URL ile arama akışını pekiştir"
minutes: 7
kind: practice
---

# URL ile arama akışını pekiştir

Bu pekiştirmede aynı Sinema aramasını üç yerde kullanacaksın: statik listeyi seçerken, ekranda filtreleri gösterirken ve route davranışını sınarken. Her açılışta URL aynıysa görünüm de aynı olmalı; geri tuşu da önceki seçimi geri getirmeli.

:::model[URL state]
Paylaşılacak veya geri tuşuyla geri gelmesi gereken seçimleri URL'den oku. Filtrelenmiş listeyi ayrıca state'e kopyalama: filmler ve geçerli URL değerleri ekranda hangi sonuçların görüneceğini zaten belirler.
:::

## Üç işi sırayla ele al

Önce gelen değerleri yorumla: sorgu metni, tür ve sayfa URL'den gelir; sayfa değeri kullanılamazsa güvenli başlangıca dön. Sonra arama ve tür koşullarına uyan listeyi bul, en son o listenin istenen bölümünü göster. Sayfalama filtreden önce yapılırsa, filtrelenmiş listenin doğru öğeleri sayfaya düşmeyebilir.

Ekrandaki input ve select de aynı seçimleri göstermeli. Bir filtre değiştiğinde artık geçersiz olabilecek sayfa numarasını sıfırla; diğer filtreyi koru. Sonraki sayfaya geçerken ise filtreleri değiştirmeden yalnızca sayfa seçimini ilerlet.

Son adımda route'u bellekte açıp kullanıcı etkileşimini taklit ederek hem adresi hem görünen başlığı kontrol et. Böylece yalnızca bir fonksiyonun değerini değil, kullanıcının gördüğü URL → ekran akışını da doğrularsın.

## Özet

- URL'den gelen metni sayı gibi kullanmadan önce doğrula; geçersiz sayfada anlaşılır bir varsayılan seç.
- Önce filtrele, sonra sayfala; ekrandaki listeyi URL ve filmlerden türet.
- Parametre güncellerken ilgisiz filtreleri koru; yeni filtre eski sayfa konumunu geçersiz kılabilir.
- Route davranışını hem URL hem görünür içerik üzerinden düşün.

**Terimler**

- **Query string:** URL'deki `?` sonrasında arama ve görünüm seçimlerini taşıyan bölüm.
- **Türetilmiş liste:** Asıl film verisiyle filtre seçimlerinden hesaplanan, ayrıca saklanması gerekmeyen liste.

**Kendini yokla:** Tür aynı kalırken arama değiştiğinde sayfa numarası neden başa döner?

**Cevap:** Yeni arama başka sayıda sonuç verebilir; eski sayfa numarası artık boş veya yanlış bir bölümü gösterebilir.
