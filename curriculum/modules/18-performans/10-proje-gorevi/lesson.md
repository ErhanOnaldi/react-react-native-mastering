---
title: "Sinema: akıcı büyük liste"
minutes: 9
kind: project
---

# Sinema: akıcı büyük liste

:::pain[Problem]
Sinema'nın gerçek aramasında 500 filme yakın sonuçlar yavaş; favori düğmesi de async onayı beklerken sessiz. Ölçtüğün üç darboğazı projede kapat.
:::

## Projeye uygula
Aramada controlled inputu güncel tut; liste için deferred değer kullan. Favori/arama listesini `@tanstack/react-virtual` ile görünür satırlara indir. Detay route'unu lazy yükle, React Compiler'ın kararlı Babel yolunu etkinleştir. Async favori akışında `useOptimistic` ile geçici görünüm ve başarısızlıkta geri dönüş sağla.

İki proje görevi farklı riskleri ölçer: ilkinde arama ve DOM boyutu, ikincisinde bekleyen favori etkileşimi. Profil sonuçlarını önce/sonra karşılaştır.

:::sector
Compiler paketleri bu içerik görevinden bağımsız koordinasyon gerektirir. Görevdeki Vite ayarını, paketler checkpoint'e eklenince doğrula.
:::

## Uygulama sırası

1. SearchPage'deki mevcut URL sorgusunu ve Query cache akışını koru. Controlled input güncel kalsın; ağır liste deferred sorguyu kullansın.
2. 500 filmlik veriyle gerçek DOM satırını say. Virtualizer sonrası görünür aralığın dışındaki satırlar DOM'da olmamalı.
3. Favori düğmesinde bekleyen ve başarısız isteği ayrı dene. Geçici kalp ile onaylı state'i karıştırma.
4. Detay route'unu lazy yükle; Compiler paketleri eklendiğinde Babel ayarını aç ve build sonucunu gözle.

Son ölçümde aynı veri, aynı sorgu ve aynı ortamı kullan. Profiler süreleri fikir verir; doğrulama için render, hesaplama ve DOM sayıları daha güvenilir karşılaştırmadır.
