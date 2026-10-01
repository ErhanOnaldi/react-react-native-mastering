---
title: "Sinema'ya sahip olduğun UI parçalarını ekle"
minutes: 7
kind: project
---

# Sinema'ya sahip olduğun UI parçalarını ekle

Bu projede Sinema'nın hazır arayüz parçalarını proje içinde düzenlenebilir hale getirip iki yerde kullanacaksın: film detayındaki fragman ve eylem menüsü, ayrıca yorum formu. Amaç görünümü yenilerken mevcut film ve gönderim davranışlarını korumak.

:::model[Compound component ve asChild]
19. modülde compound component'leri, yani ortak davranış için birlikte çalışan UI parçalarını gördün. `asChild`, bir parçanın davranışını kendi oluşturduğu düğme yerine verdiğin çocuk elemana taşır. Dialog ve menü portal içinde açılır; portal, içeriği bileşenin olağan DOM konumunun dışında gösterir. Parçaları birlikte kullanırken klavye davranışını ve linkin link olarak kalmasını da koru.
:::

:::model[Tema token'ları]
4. modülde tema token'larıyla görünüm rengini tek tek bileşenlere yazmadan yönetmeyi öğrendin. Dialog ve menü portal içinde açıldığından, koyu tema sınıfının ortak `<html>` kökünde olması bu pencerelerin de temayı almasını sağlar.
:::

## Önce mevcut akışı tanı

`components.json`, alias'ları, tema ayarını ve film detayındaki etkileşimleri oku. Sonra UI parçalarını ekleyip eski kullanımları taşı. Fragman, favori ve TMDB bağlantısının ne yaptığını kontrol et; yeni görünüm eski film akışını değiştirmemeli.

Yorum formunda puan tek seçimli bir grup, alanlar ise etiket ve hata mesajlarıyla birlikte çalışır. Formun mevcut yükleniyor, başarı ve hata akışını koru; özellikle sunucu hata verdiğinde yazılmış yorumun kalıp kalmadığını gözden geçir.

Çalışmanı önce fareyle, sonra klavyeyle dene. Dialog ve menüyü açıp kapat; Escape sonrasında odağın nereye döndüğüne, koyu temada portalın görünümüne ve formdaki alan mesajlarına bak.

## Özet

- Mevcut veri ve gönderim akışını korurken UI parçalarını projeye taşı.
- Dialog ve menü etkileşimlerini klavyeyle de dolaş.
- Form etiketlerini, hata mesajlarını ve portal temasını kontrol et.

**Terimler:** `asChild` — davranışı çocuk elemana aktarır; `portal` — içeriği bileşenin olağan DOM konumunun dışında görüntüler.

**Kendini yokla:** Dialog koyu temaya geçmiyorsa nereden başlarsın? Tema sınıfının dialog portalını da kapsayan `<html>` kökünde olup olmadığını kontrol ederim.
