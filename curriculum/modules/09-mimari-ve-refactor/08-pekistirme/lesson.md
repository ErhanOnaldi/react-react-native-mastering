---
title: "İki gerçek taşıma"
minutes: 6
kind: practice
---

# İki gerçek taşıma

:::pain[Problem]
Arama ve detay ekranı ayrı ayrı çalışıyor; fakat ikisi de URL, ortak istek bilgisi ve sonuç görünümünü kendi içinde tekrarlıyor. Bir düzeltme iki yerde unutulabiliyor.
:::

:::model[UI ile davranışın sınırı]
Tekrarlanan davranışı hook veya saf birime taşı; loading, error, empty ve success hallerini component'te görünür kıl. Burada yenilik, sınırı iki farklı yerde uygulaman: aramada URL/fetch ayrımı, detayda görünüm/afiş ayrımı.
:::

Bu pratikte önce çalışan çıktıya bak, sonra yalnız tek iç sorumluluğu ayır. Arama örneğinde ilk sayfa ile sonraki sayfa farklı kod yollarından gidiyor. URL kurulumunu tek kurala toplamak Türkçe arama metnini ve page değerini korumalı. Yeni bir özellik eklemeye çalışma; amaç mevcut davranışı daha az tekrar ile sürdürmek.

Detay görünümünde tekrar ağda değil, JSX'te: afişi olan ve olmayan veri ayrı kart dallarına ayrılmış. Başlıkla açıklama her iki durumda aynı kalır, yalnız afiş görünümü değişir. Bu farkı küçük bir görünüm bileşenine ayırmak ortak gövdenin kopyalanmasını önler.

## Çalışma sırası

1. Başlangıç çıktısını ve boş/normal sınır değerini oku.
2. Bir sorumluluğu ayır; aynı anda metin veya endpoint davranışını değiştirme.
3. Eski örneklerin hâlâ aynı çıktıyı verdiğini doğrula.
4. Rubric'i kod okunurluğu ve yeni birimin gerçek akışta kullanılması için ayrıca incele.

:::mistake[Sık hata]
**Belirti →** Başlık refactor sonrası değişti. **Neden →** Görünüm temizliği ile ürün metni değişikliği aynı adıma girdi. **Düzeltme →** Önce eski davranışı koru; yeni metni ayrı gereksinim olarak ele al.
:::

:::sector
Bakım PR'larında aynı değişikliği tek sahipli bir noktaya toplamak hata düzeltmelerini ucuzlatır. Küçük refactor adımları reviewer'ın önce/sonra davranışını anlamasını kolaylaştırır.
:::

## Özet

- URL üretimini ayrılaştırırken sorgu ve sayfayı koru.
- Ortak görünüm ile değişen afiş davranışını ayır.
- Test edilen davranış ile kod kalitesini ayrı değerlendir.

**Kendini yokla:** Afiş yokken başlık tekrar etmesin diye neyi ortaklaştırırsın?  
*Cevap:* Başlık/açıklama gövdesini tek render noktasında bırakıp yalnız afiş kararını ayırırsın.
