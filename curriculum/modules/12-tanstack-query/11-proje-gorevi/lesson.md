---
title: "Sinema verisini ortak cache'e taşı"
minutes: 7
kind: project
---

# Sinema verisini ortak cache'e taşı

:::pain[Problem]
Sinema’da aramaya geri dönünce aynı GET tekrarlanıyor; sayfa değişince liste boşalıyor; trendden filme giderken detay bekleniyor. Bunlar üç ayrı ekran ayrıntısı gibi görünse de ortak sorun, sunucu verisinin her sayfanın yerel state’inde yeniden kurulması.
:::

## Geçişi ölçerek yap

Önce her ekranın hangi veriyi istediğini ve URL’de hangi seçimlerin bulunduğunu çıkar. Home, Search, Details ve Favorites ekranları aynı query altyapısını paylaşacak; favori id’leri kullanıcıya ait state olarak kalacak. Filtre, arama ifadesi, id ve sayfa numarası cevabı değiştiriyorsa aynı veri kimliğine de yansımalı.

Çalışma sırası: uygulama cache sınırını ve query tariflerini kur; sayfaları tek tek taşı; sayfalama geçişinde kullanıcıya eski verinin geçici olduğunu göster; son olarak trend akışını biriktir ve kart niyetinde detay verisini hazırla. Her aşamada aynı kullanıcı yolunu tekrar ederek Network sayacını karşılaştır. API fonksiyonlarının hata ve kimlik doğrulama davranışını koru.

:::model[Query options factory]
Bir key ile query function aynı tarifte buluşur; farklı component’ler aynı tarifi kullanabilir. Bu proje boyunca tarifleri sayfalar, önceden hazırlama ve liste akışları arasında paylaş. Yeni olan, modelin birden fazla ekran ve filtreyle birleşmesidir.
:::

:::sector
Gerçek projede geçişi küçük parçalara ayır: önce provider ve query sözleşmeleri, sonra kullanıcıya görünen ekranlar, ardından performans davranışları. Küçük adımlar hata kaynağını daraltır ve ekip arkadaşlarının değişikliği incelemesini kolaylaştırır.
:::

## Özet

- Sunucu verisini ortak cache’e taşı; URL ve client state’i ayrı tut.
- Bütün veri belirleyicilerini key’lere bağla.
- Aynı kullanıcı akışında istek sayısını yeniden ölç.

**Kendini yokla:** Favori seçimi neden query cache’e taşınmıyor? Cache dönüşünün çalıştığını nasıl anlarsın?

**Yanıt:** Favori seçimi kullanıcı tercihidir; sunucu cevabı değildir. Geri dönüş akışında tekrar GET’in azaldığını ölç.
