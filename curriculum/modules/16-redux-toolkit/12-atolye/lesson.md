---
title: "State sahipliğini farklı ürünlerde uygula"
minutes: 7
kind: practice
---

# State sahipliğini farklı ürünlerde uygula

:::pain[Problem]
Bir katalog uygulamasında görünüm değiştirince film listesi boşalıyor; favori işareti tür değiştirip geri dönünce kayboluyor. Başka bir ekranda arama metni adres çubuğuyla, cache ile ve form değeriyle yarışıyor. Her değerin sahibini belirlemeden güncelleme sınırlarını kurmak zorlaşıyor.
:::

:::model[State sahipliği]
Sunucudan gelen katalog verisi Query’de, paylaşılabilir filtre URL’de, kişisel favori ortak client state’te, form taslağı RHF’de yaşar. Aynı ekranda bu sahiplerin verilerini birleştirebilirsin; fakat birinin değişmesi diğerini sıfırlamamalıdır.
:::

:::model[Redux selector ve snapshot]
Store action sonrası yeni immutable snapshot üretir; selector bileşenin ihtiyaç duyduğu sonucu okur. Favori gibi kimliğe bağlı seçim liste sırasına bağlanmaz, görünüm değişikliği de server query’sini gereksiz yere tetiklemez.
:::

## Görevleri çözme sırası

İlk üç görev, film keşfi ve arama ekranında URL, Query cache ve client seçimini birlikte kullanır. Filtre değişirken favorinin kalıp kalmadığını; görünüm değişiminin veri isteğinden bağımsız olup olmadığını gözle. Geri/ileri gezinme de aynı ekran state’inin URL ve cache ile tutarlı olmasını gerektirir.

Son iki görev daha açık uçludur: kişisel ürün koleksiyonu ve kullanıcı gönderi/yorum akışı. Önce kaynakları ve kullanıcı seçimlerini ayır, sonra ekranların durumlarını tasarla. Atölye görevlerinde dosya yapısını sen belirlersin; proje kökünde geliştir ve sonunda görev sayfasındaki AI review akışını kullan.

Kısa çalışma sırası:

1. Her bilgi için kaynağı, ömrü ve paylaşılma gereksinimini yaz.
2. Loading, hata, boş sonuç ve dolu içerik durumlarını ayrı ayrı düşün.
3. URL geçmişi gerektiren değerleri adres çubuğuna bağla.
4. Kullanıcı seçimini sunucu cevabından bağımsız sakla; görünümü türetilmiş veriden kur.
5. Filtreyi değiştir, geri dön, yenile ve aynı kaydın hâlâ doğru yerde olduğunu kontrol et.

:::mistake[Belirti → Filtre değişince kullanıcı seçimi siliniyor]
Belirti → Kategoriye dönünce işaretli ürün seçilmemiş görünüyor.  
Neden → Seçim listedeki dizi indeksine veya geçici sonuç nesnesine bağlanmış.  
Düzeltme → Seçimi kalıcı ürün/film kimliğiyle ilişkilendir.
:::

:::mistake[Belirti → Her görünüm değişiminde ağ isteği atılıyor]
Belirti → Kart/liste tercihini değiştirmek yeni katalog isteği başlatıyor.  
Neden → Görünüm tercihi sorgu girdisine dahil edilmiş.  
Düzeltme → Yalnız sunucu sonucunu gerçekten değiştiren parametreleri query key’e koy.
:::

:::sector
Frontend ekipleri ekran gereksinimlerini state sahipliği tablosu ve loading/error/empty durumlarıyla birlikte ele alır. Bu yaklaşım bir sayfada Query, Router, store ve form kütüphanesinin neden yan yana bulunabildiğini açıklar; doğru sınır, tek kütüphaneye her şeyi yüklemek değildir.
:::

## Özet

- Her değerin sahibini ve yaşam süresini seç.
- URL gezinme geçmişi, Query server cache, store kişisel ortak state taşır.
- Liste/filtre değişince kimliğe bağlı kullanıcı seçimi korunmalı.
- Açık uçlu uygulamada boş, yükleniyor ve hata durumlarını da tasarla.

**Kendini yokla:** Kullanıcının favori tercihi, sunucu sonucunda film geçici görünmedi diye neden silinmemeli?  
*Cevap:* Favori kullanıcıya ait bağımsız client state’tir; sorgu sonucunun geçici görünürlüğüyle aynı yaşam döngüsüne sahip değildir.
