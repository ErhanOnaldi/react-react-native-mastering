---
title: "Sinema'nın UI kit'ini tamamla"
minutes: 6
kind: project
---

# Sinema'nın UI kit'ini tamamla

:::pain[Arayüz akışı kopya class'lara bağlı]
Sinema'da favori ve arama davranışı çalışıyor ama MovieCard, SearchBox ve diğer görünür parçalar kendi HTML ve class kararlarını taşıyor. Ortak kit'e geçerken arama ve favori akışının aynı kalması gerekiyor.
:::

## Önce altyapı, sonra gerçek kullanım

İlk görev, token ve class birleştirme katmanıyla UI primitive'lerini Sinema'ya ekler. Button sınırlı varyant ve boyutları sunar; Card, Badge, Skeleton ve Input kendi doğal HTML öğelerine dayanır. Bütün parçalar aynı `cn` sözleşmesini kullanır. Koyu tema rengi CSS katmanında seçilir.

İkinci görev, MovieCard ve SearchBox'ı bu kit'e geçirir. Bu aşamada kartın nasıl renklendirileceği sana kalır; kullanıcıya görünen içerik, favori durumu, arama değeri ve tıklama davranışı aynı ürün anlamını korumalıdır. Bir tasarım sistemi yalnız class listesi değildir: HTML semantiği, erişilebilir ad ve native props da bileşen sözleşmesidir.

:::model[Ortak görünüm ve ürün davranışını ayrı tut]
Varyant tablosu görünümü seçer, primitive native etkileşim props'larını taşır, üst ürün bileşeni arama/favori state'ini sahiplenir. Bu projede değişen şey UI primitive'lerinin gerçek ekranlarda kullanılmaya başlamasıdır.
:::

## Uygularken izle

Önce helper ve UI dosyalarının birbirine nasıl bağlanacağını kur. Ardından Button varyantlarını ve boyutlarını yan yana göstererek her seçeneğin görünür biçimde ayrıldığını kontrol et. Bir Badge'i Card içinde kullan; Skeleton'ın yer tuttuğunu ve Input'un label alabileceğini doğrula.

Sonraki aşamada bir filmi favoriye ekle, arama alanına başlık yaz ve listeden bir sonucu aç. Klavyeyle butonlara ulaş; açık ve koyu temadaki metin/zemin ayrımını kontrol et. Kart görünümü farklılaşabilir ama favori state'i, controlled arama değeri ve başlık kaybolmamalı.

Takıldığında her değişikliği tek katmanda daralt: `cn` class çatışmasını mı çözüyor, varyant fonksiyonu doğru class'ı mı üretiyor, yoksa gerçek `<button>` doğru props'ları mı alıyor? Ekran görüntüsü yanında DOM props'larını ve etkileşimi kontrol et. Böylece stil sorunu ile state veya HTML davranışı sorununu ayırabilirsin.

:::sector
Design system geçişleri genellikle çalışan ürün akışlarını koruyarak yapılır. Takım, ortak bileşenleri önce temel durumlarıyla oluşturur; sonra ekranları parça parça geçirir ve davranış değişmediğini kontrol eder.
:::

## Özet

- Önce token/helper ve primitive katmanı kurulur; sonra gerçek ekranlar onu kullanır.
- Button varyantları görünüm kararlarıdır, native props davranışı taşır.
- SearchBox kontrollü kalır; favori state'i kartın dışındaki state sahibinde kalır.
- Görsel tasarım değişebilir ama erişilebilir ad, state ve callback sözleşmesi korunur.

**Kendini yokla:** UI kit'e geçişte hangi davranışları tekrar denersin? Arama, favori, erişilebilir ad ve klavye odağı.
