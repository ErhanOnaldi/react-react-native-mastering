---
title: "Sınırları sen seç"
minutes: 6
kind: practice
---

# Sınırları sen seç

:::pain[Problem]
Aramadan geri dönünce URL başka, sonuç başka söylüyor. Film listesi ikinci ekranda yeniden yazılmış; filtre sayısı arttıkça hangi parçanın neyi yönettiği belirsizleşiyor.
:::

:::model[State kategorileri]
Server cevabı, paylaşılabilir URL seçimi, yerel tercih ve form taslağının farklı sahipleri vardır. Atölyede bu ayrımı yeni ürün keşif bağlamına taşı: arama/kategori bağlantıda geri kurulmalı, açılan detay seçili ürüne bağlı olmalı, API sonucu servis sahibi olarak kalmalı.

![Server, client, URL ve form state'in sahibini gösteren karar haritas](diagram:state-kategorileri)
:::

Buradaki ilk üç çalışma code egzersizidir. Public component'i kullanıcı gibi çalıştır; yöntem seçimi sana ait. Aynı liste görünümünü iki akışta kullanırken loading, error ve boş başarı hallerini unutma. Filtre kontrolü için iki tasarım da geçerlidir: tüm değerleri tek nesneyle yönetebilir ya da seçimleri ayrı parçalar halinde sunabilirsin. Seçimini kod yorumunda ve gerçek bir bakım gerekçesiyle açıkla.

Son çalışma `projects/atolye` içinde gerçek ürün keşif ekranı kurar. Repo kökünde sırasıyla `pnpm setup:projects atolye`, `pnpm install`, ardından `cd projects/atolye && pnpm dev` çalıştır. Uygulamayı aç, arama veya kategori seçiliyken ürüne gir ve geri dön; seçim korunuyor mu, boş/hata durumları okunuyor mu bak. Bitince görev sayfasındaki “AI review prompt'unu kopyala” akışıyla rubric üzerinden incele.

:::mistake[Sık hata]
**Belirti →** Detaydan geri dönünce arama sıfırlanıyor. **Neden →** Paylaşılabilir seçim yalnız component state'inde kaldı. **Düzeltme →** Arama ve kategori gibi seçimleri URL'de tut; detay kimliğini route'a bağla.
:::

:::sector
Atölye görevlerinde çözüm yolunu seçmek, gerçek ürün çalışmasının parçasıdır. Önce kullanıcı davranışını ve state sahibini tarif et; sonra component sınırını ve dosya düzenini bu karara göre kur.
:::

## Özet

- Kullanıcı davranışını doğru public yüzeyden değerlendir.
- Liste görünümünü veri alma davranışından ayır.
- Mimari ürün görevinde URL, API ve feature sahipliğini birlikte koru.

**Kendini yokla:** Arama sonucu listesini popüler film ekranında da kullanmak için ilk hangi sınırı düşünürsün?  
*Cevap:* Ortak UI görünümünü data props'larıyla besleyip her ekranın veri kaynağını ayrı tutmayı.
