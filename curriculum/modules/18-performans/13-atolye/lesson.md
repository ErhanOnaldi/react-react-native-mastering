---
title: "Büyük veri, az yönlendirme"
minutes: 6
kind: practice
---

# Büyük veri, az yönlendirme

:::pain[Problem]
Film aramasında yıldız başka filme kayıyor; türler arasında hızlı geçişte eski sonuç görünüyor. Yapılacaklar panosunda da seçim değiştikçe büyük liste takılıyor.
:::

## Belirtiyi gereksinime çevir

Atölye görevlerinde sana davranışı ve ürün ihtiyacını veren kısa bir belirti sunulur. Önce hangi verinin kalıcı, hangisinin türetilmiş olduğunu belirle; ardından bir etkileşimi değiştirip ekrandaki sonucu izle. Mimari görevde projedeki dosyaları inceleyip küçük adımlarla ilerle, sonra AI review ile çalışmanı gözden geçir.

:::model[Ağaç ve kimlik]
React state'i bileşenin ağaçtaki konumuna ve key'e bağlıdır. Liste filtrelenip sıralanınca konum değişir; seçimi öğenin kendi id'sine bağlamak kimliği korur.

:::

![Ağaç konumu ve key state kimliğini belirler](diagram:agac-ve-kimlik)

:::model[Render nedenleri]
Props, state ve context değişiklikleri render başlatır. Pahalı türetilmiş hesabı yalnız girdileri değiştiğinde yenile; memoization yanlış state modelini düzeltmez.

:::

![Render nedenlerini ve memo sınırlarını gösteren akış](diagram:render-nedenleri)

## Çalışma sırası

1. Belirtiyi aynı kullanıcı akışıyla yeniden üret.
2. Hangi veri kaynağının değiştiğini ve ekranda neyin bayat kaldığını kaydet.
3. Kimlik, sıralama veya filtre hesabına tek bir düzeltme uygula.
4. Boş, tek öğeli ve hızlı ardışık değişiklikleri dene.
5. Proje görevinde yükleniyor, hata ve boş liste durumlarını ayrıca kontrol et.

:::mistake
**Belirti:** liste yenilenince seçim başka öğeye geçer. **Neden:** state konuma bağlanmıştır. **Düzeltme:** seçimi öğe id'siyle sakla ve key olarak id kullan.
:::

:::mistake
**Belirti:** filtre değişince eski içerik kısa süre görünür. **Neden:** yükleme/parametre değişimi ile sonuç verisi ayrılmamıştır. **Düzeltme:** güncel seçimi ekranda tut, veriyi parametreye göre eşleştir ve geçişi gözlenebilir yap.
:::

:::sector
Ürün ekipleri performans düzeltmesini kullanılabilirlikle birlikte değerlendirir: seçim doğru öğede kalmalı, veri yüklenirken ekran anlaşılır olmalı ve boş sonuç da tanımlı görünmelidir.
:::

## Özet

- Önce belirtileri tekrarla ve ölç.
- State'i ait olduğu kimliğe bağla.
- Türetilmiş listeyi gerçek girdilerinden üret.
- Boş, hata ve hızlı geçiş durumlarını dene.
