---
title: "Kart parçalarını birleştir"
minutes: 6
kind: practice
---

# Kart parçalarını birleştir

:::pain[Her sayfa kendi kartını çiziyor]
Arama sonuçları ve kaydedilen filmler aynı puan etiketini farklı renk ve boşluklarla gösteriyor. Yükleme sırasında kart boyu da değiştiği için poster listesi aşağı yukarı sıçrıyor.
:::

## Küçük parçalarla ortak görünüm

Bir UI parçası tek bir sorumluluğu üstlenir: `Badge` kısa puan veya tür bilgisini taşır, `Card` içeriği çerçeveler, `Skeleton` yüklenirken yaklaşık alanı tutar, `Input` kullanıcı girdisini alır. Her parçanın doğal HTML öğesi ve props'ları, farklı kullanım yerlerine uyum sağlar.

Bu alıştırmalarda composition, native props ve class override kararlarını farklı içeriklerde birleştir. Çocuk içeriğini component dışında bırak; kartın içinde başlık, `Badge` ve eylem olabilir. Input'un label'ı kullanım yerine aittir çünkü aynı primitive farklı formlarda kullanılır.

:::model[UI primitive görünümü paylaşır, state'i sahiplenmez]
Doğal öğenin props'larını aktar, className override'ını ortak class birleştiricisinden geçir, görsel Skeleton'ı erişilebilirlik ağacından gizle. Arama değeri veya favori state'i gibi ürün verisini primitive içine taşıma.
:::

## Çalışma sırası

Önce bir `article` tabanlı kart içinde başlık ve puanı composition ile yerleştir. Sonra temel class'ların yanına dışarıdan gelen `className` değerini ekleyip padding'in değiştiğini gözle. Skeleton için `aria-hidden="true"` ve ölçüyü koruyan class'lar kullan. Input'a erişilebilir adını çevredeki label veya `aria-label` ile ver.

İkinci görevde yükleme yer tutucusunu arama alanıyla yan yana düşün. Görsel öğe ve etkileşimli öğenin props ihtiyaçları farklıdır; ikisini aynı HTML tag'ine zorlamak yerine kendi native element props tiplerini kullan. Input `value` ve `onChange` ile controlled kalır; primitive state saklamaz.

### İlerlerken kendine sor

- Dışarıdan gelen `p-8` temel `p-4` class'ını gerçekten değiştirebiliyor mu?
- İçeriği component içine sabitlemek yerine `children` ile vermek neden tekrar kullanımı kolaylaştırıyor?
- Skeleton'ın kendisi mi yükleniyor bilgisini vermeli, yoksa çevresindeki arayüz mü?

Her cevabı kod üzerinde doğrula. Bir primitive farklı içerikle çalışıyor ve native `data-*`, `aria-*`, event props'larını koruyorsa arayüzü esnek kalır. Yükleme state'i, arama metni ve kart seçimi ürün bileşeninde veya üst state sahibinde durmalıdır.

:::sector
Ürün ekipleri UI primitive'lerini farklı sayfalarda aynı HTML ve görünüm sözleşmesini korumak için kullanır. Paylaşılan bileşen çok genel hale gelirse tasarım kararları props yığınına dönüşür; ortak kalan kısımları çıkar, içerik ve state'i kullanım yerinde bırak.
:::

## Özet

- `Card`, `Badge`, `Skeleton` ve `Input` ayrı sorumlulukları olan primitive'lerdir.
- `children` içerik bileşimini kullanım yerine bırakır.
- Native props ve `className` primitive'in gerçek HTML davranışını korur.
- Görsel Skeleton yükleme alanını tutar; yükleme mesajını çevreleyen arayüz verir.
- Controlled Input değeri kendi içinde saklamaz.

**Kendini yokla:** UI primitive'i arama değerini kendi state'inde tutmalı mı? Hayır, kullanım yeri controlled props verir.
