---
title: "Sinema için lint ve format kapısı"
minutes: 6
kind: project
---

# Sinema için lint ve format kapısı

:::pain[Problem]
Sinema’da film kimliği değişince eski detay kalabiliyor. Kullanılmayan import’lar dosyalarda birikmiş, farklı editör tercihleri de PR diff’ini biçim satırlarıyla dolduruyor. Araçları öğrendin; şimdi bu geri bildirimi gerçek projede tekrarlanabilir hale getir.
:::

## Proje çalışmasının kapsamı

İki görev önce ESLint’i proje kaynaklarına bağlayacak, ardından Prettier tercihlerini ve komutlarını ekleyeceksin. İlk bölümde TS/TSX dosyalarının gerçekten lint edildiğini, React’e özgü hataların raporlandığını ve film kimliği değişiminde detayın güncellendiğini hedefle. İkinci bölümde tek tırnak, noktalı virgülsüz biçim ve Tailwind v4 class sıralamasını ortaklaştır; geliştirme ve CI için ayrı komutlar tanımla.

Buradaki önemli karar, hata mesajını susturmak değil, kaynak niyetine göre düzeltmektir. Film değişimini denetleyen effect yeni kimliği izlemeli ve eski istek sonradan dönüp yeni sonucu ezmemelidir. Biçimleme ise davranışa dokunmadan görünüş farklarını azaltmalıdır.

## Çalışma sırası

Önce proje kökünde lint yapılandırmasını kur ve TS/TSX kaynaklarında raporun gerçekten üretildiğini gözle. Hook ve React component dosyalarını ayrı ayrı düşün; sonra detay sayfasının route değişimindeki davranışını düzelt. Format config’ini ve ignore listesini ekledikten sonra yazma komutuyla mevcut dosyaları biçimle, CI’da kullanacağın kontrol komutunun temiz olduğunu doğrula.

İki görevin sonunda Sinema’da ortak kalite komutları ve okunabilir config bulunmalı. Lint, uygulama davranışı testlerinin yerine geçmez; formatter da hatalı veriyi düzeltmez. İkisi sonraki modülde yapacağın refactor öncesi daha anlaşılır bir kod tabanı hazırlar.

:::sector
Ekipler bu tür kalite kapılarını mevcut projeye küçük değişiklikler halinde ekler. Önce gerçek lint raporunu okuyup kaynakta düzeltme yapar, sonra formatı uygular ve CI’da yalnız kontrol çalıştırır. Böylece config, günlük geliştirme ve PR incelemesinin ortak parçası olur.
:::

## Özet

- Lint config’i TS/TSX kaynaklarına gerçekten uygulanmalı.
- Detay kimliği değişince yeni film gösterilmeli; gereksiz eski sonuç yazmamalı.
- Prettier görünüşü düzenler; `format:check` yalnız farkı raporlar.
- Kaynak kod hatalarını susturmak yerine niyete uygun düzelt.

**Kendini yokla:** Proje lint’ten geçse bile neden detay sayfasını route değişiminde gözlemlemelisin?
*Cevap:* Lint statik kuralları denetler; kullanıcı davranışının doğru olduğunu kanıtlamaz.
