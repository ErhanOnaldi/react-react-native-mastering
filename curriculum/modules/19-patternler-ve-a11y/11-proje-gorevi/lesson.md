---
title: "Sinema modalı ve detay sekmeleri"
minutes: 7
kind: project
---

# Sinema modalı ve detay sekmeleri

Sinema film detayında fragmanı açıp klavyeyle kullanılabilen bir pencerede gezin; özet, oyuncular ve varsa videoları sekmelerle düzenle. Önceki derslerdeki erişilebilir davranışları gerçek film verisine bağlayacaksın.

## Modal parçalarını birleştir

**Compound component**, ortak davranışı paylaşan ama JSX'te ayrı yerleştirilen component ailesidir. Trigger açar, Content dialogu gösterir, Close kapatır. **Context**, aradaki component'lere prop eklemeden ortak değeri alt bileşenlere ulaştırır.

:::model[Context yayılımı]
Kök Context sağlar, alt parçalar aynı güncel değeri okur. Modal parçaları kökün dışında kullanılırsa eksik Context için anlaşılır hata vermelidir.
:::

**Dialog**, sayfa üzerinde açılan etkileşimli penceredir. Bir **Portal**, React içeriğini DOM ağacında başka bir yere, burada `document.body` altına yerleştirir. Açılınca focus dialoga, kapanınca tetikleyiciye dönmeli; Tab ve Shift+Tab dialog içinde kalmalı. **`asChild`**, Trigger'ın kendi düğmesi yerine verilen child öğeyi kullanmasını sağlar; böylece button içine button koymazsın.

Fragman düğmesi yalnızca filmde video varsa görünür. Sayfadaki video verisinden fragmanı seç; video yoksa düğme üretme.

## Sekmeleri film verisine bağla

`tablist`, `tab` ve `tabpanel` rolleri ekran okuyucuya sekme grubu, seçenek ve panel anlamını verir. Trigger ile Panel'in id ilişkisi eşleşmeli; `useId` her grup için benzersiz id tabanı üretir. Video yoksa Videolar Trigger'ı ve Panel'i birlikte gizle.

Fragman düğmesi sekme grubunun dışında ve görünür kalır. Favori düğmesinin erişilebilir adı eylemi, basılı durumu ise seçimi anlatmalı; bu iki bilgi birbiriyle çelişmesin. **Suspense**, veri beklenirken geçici arayüz göstermeye yarar; mevcut yükleme akışını koru.

:::model[Render → commit → effect]
React DOM'u güncelledikten sonra effect çalışır. Focus DOM'a bağlı olduğundan açılışta dialog eklendikten sonra odak ver; kapanışta tetikleyicinin hâlâ sayfada olup olmadığını gözet.
:::

Önce modalı, sonra Tabs parçalarını kendi başına ele al; ardından 550 numaralı filmde ve videosu olmayan bir filmde sayfayı fareyle ve klavyeyle dolaş. Bu sıra, hata çıktığında modal davranışını veri koşullarından ayrı incelemene yardım eder.

## Özet

- Modal parçaları ortak durumu paylaşır; her parçanın ayrı görevi vardır.
- Focus açılışta dialoga, kapanışta tetikleyiciye döner.
- Tabs id'leri her Trigger'ı kendi Panel'ine bağlar.
- Video yoksa Videolar sekmesi, paneli ve fragman tetikleyicisi görünmez.
- Parçaları ayrı, sonra gerçek film detayında klavyeyle dolaş.

**Yeni terimler**

- **Compound component:** Ortak davranışla çalışan, ayrı yerleştirilebilir component ailesi.
- **Context:** Değeri aradaki component'lere prop eklemeden alt bileşenlere ulaştırma yolu.
- **Portal:** React içeriğini DOM ağacında başka bir yere yerleştirme yöntemi.
- **`asChild`:** Verilen child öğeyi kullanıp fazladan düğüm üretmeme yaklaşımı.
- **`useId`:** DOM ilişkileri için component örneğine özel id üretir.
- **Suspense:** Alt arayüz hazır olana kadar geçici içerik göstermeyi sağlar.

**Kendini yokla:** Filmde video yoksa ne görünmemeli?

*Cevap:* Videolar sekmesi ve paneli ile fragman tetikleyicisi.
