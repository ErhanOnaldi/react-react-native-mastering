---
title: Sinema proje görevi
minutes: 9
kind: project
---

# Sinema proje görevi

:::pain[Problem]
Sinema’nın tipleri hazır ama ekranda gerçek bir film seçme akışı yok. API çağrısına geçmeden önce statik örneklerde arama ve favori işaretlemenin birlikte doğru çalıştığını görmek istiyorsun.
:::

## Bu checkpoint’in sınırı
Önce fixture’lardaki filmlerden tipli `sampleMovies` dizisini oluştur. `MovieCard`, `MovieGrid` ve controlled `SearchBox` bileşenlerini kendi dosyalarına ayır. `App`, sorguyu ve favori id’lerini yönetsin; başlığa göre filtrelenen listeyi render sırasında türetsin.

`Movie` ve `posterUrl` sözleşmeleri önceki modüllerden geliyor. Boş `poster_path` olasılığını unutma. Film verisini bu aşamada ağdan çekme: fetch, loading ve hata durumlarını sonraki modüllerde ihtiyaç doğunca işleyeceğiz.

## Kontrol
`Dövüş` yazınca Dövüş Kulübü kalmalı; bir filmi favoriye ekleyip aramayı silince işaret korunmalı. Farklı bir filmi işaretlemek ilkini silmemeli. Proje testleri ekrandaki rol ve metin üzerinden bu davranışları kontrol eder.

:::sector
Veri kaynağını basit tutmak, bileşen sözleşmesini ve state akışını ayrı ayrı doğrulamayı kolaylaştırır.
:::
