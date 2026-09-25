---
title: Pekiştirme: film tarayıcısı
minutes: 9
kind: practice
---

# Pekiştirme: film tarayıcısı

:::pain[Problem]
Sinema’da arama çalışıyor ama favori düğmesine basınca sonuç listesi eski işareti gösteriyor. Sıralama ekleyince input notları da yer değiştiriyor. Tek tek doğru görünen parçalar beraber çalışmalı.
:::

## Parçaları birleştir
Bu derste statik film dizisiyle iki küçük uygulama kuracaksın. İlkinde arama ve favori state’i ortak üst bileşende; görünür filmler `filter` ile türetilmiş. İkincisinde seçim ve sıralama aynı listede çalışacak. Dizi kopyalamayı ve sabit id key’lerini unutmamak için özellikle etkileşim sırasını değiştirerek dene.

Bir arama sonucu boşsa kullanıcıya açık mesaj göster. Favori düğmelerinin adını ve `aria-pressed` durumunu anlaşılır tut. Böylece hem ekran okuyucu hem davranış testleri bileşeni kullanabilir.

## Kendini sınamak için
Önce arama yapıp favori işaretle. Sonra aramayı temizle: aynı film hâlâ favori mi? Bir listeyi sırala, seçimi kontrol et ve tekrar eski sıraya dön. Bu farklı sıra, state’in film kimliğine mi yoksa satır konumuna mı bağlı olduğunu açığa çıkarır.

:::sector
Birleşik testler tek fonksiyonun doğruluğunu değil, kullanıcı adımlarının tutarlılığını ölçer.
:::
