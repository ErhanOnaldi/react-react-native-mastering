---
title: "Sinema'nın sınırlarını kur"
minutes: 7
kind: project
---

# Sinema'nın sınırlarını kur

:::pain[Problem]
Egzersizlerde ortak client ve feature API'sini ayırdın; Sinema v1'de token, URL ve hata kontrolü hâlâ sayfalara dağılmış durumda. Yeni endpoint eklerken aynı kuralı tekrar yazmak gerekiyor.
:::

Bu proje, öğrendiğin sınırları çalışan Sinema uygulamasına taşır. Ana sayfa, arama, tür filtresi, detay ve favori davranışı değişmeden kalmalı. Dosyaları taşıdıktan sonra import yollarını güncelle; ardından ortak HTTP kapısını kur ve son olarak filmlere ait anlamlı fonksiyonları feature katmanında topla.

:::model[Feature'dan shared'e bağımlılık]
Feature kendi endpoint anlamını taşır ve ortak HTTP katmanını çağırır; shared geriye dönüp feature'ı bilmez. Bu projede yeni olan, bu yönü çalışan uygulamanın mevcut dosyalarına uygulamaktır.
:::

## Üç teslim

1. Feature ve shared sahipliklerini kur, ortak yardımcıları doğru yere taşı ve alias ayarlarını eşleştir.
2. Bearer, Türkçe dil, ortak hata dönüşümü ve query kurallarını tek HTTP client'ta uygula.
3. Trend, arama, tür, detay ve tür listesi endpoint'lerini isimli film API fonksiyonları olarak sun; sayfaları bu API'ye bağla.

Her taşıma küçük tut: bir dosyayı taşı, importları düzelt, sonra diğerine geç. Arama ve sayfalama için URL seçimiyle ekrandaki içerik aynı kalmalı. `get<T>` bir type hint'tir; sunucudan gelen JSON'u runtime'da doğruladığını iddia etme.

:::mistake[Sık hata]
**Belirti →** Yeni client kullanılıyor ama sayfalarda eski `fetch` kopyaları da kalmış. **Neden →** Taşıma yarıda bırakılmış. **Düzeltme →** Her endpoint'in ortak client'tan geçtiğini ve eski uygulamanın kaldırıldığını gözden geçir.
:::

:::sector
Üretim uygulamalarında feature API ile protokol client'ının ayrılması, yeni backend veya cache katmanına geçişi yerel tutar. Dosya yolu ve export adları sonraki çalışmaların entegrasyon yüzeyidir.
:::

## Özet

- Önce sahipliği, sonra ortak HTTP politikasını, en son endpoint API'sini kur.
- Dış davranışı koru; `@/` ayarını TypeScript ve Vite'ta aynı köke bağla.
- `get<T>` runtime schema doğrulaması değildir.

**Kendini yokla:** Bir film endpoint'inin yolunu hangi katman bilmeli?  
*Cevap:* Film feature API'si; ortak client HTTP kurallarını uygular.
