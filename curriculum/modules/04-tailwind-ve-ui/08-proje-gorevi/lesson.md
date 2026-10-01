---
title: "Sinema'nın UI kit'ini tamamla"
minutes: 6
kind: project
---

# Sinema'nın UI kit'ini tamamla

Bu projede önce Sinema'nın ortak UI parçalarını kurup sonra gerçek film ekranlarında kullanacaksın. İlk bölüm görünüm ve HTML sözleşmelerini bir araya getirir; ikinci bölüm MovieCard ve SearchBox'ı bu parçalara geçirirken arama ile favori davranışını korur.

:::model[Token'dan utility'ye üç adım]
Tasarım kararı token'da ad alır, Tailwind utility'si o kararı kullanır, bileşen de arayüzde uygular. Tema renkleri değişebilir; bileşenin anlamlı class seçimi aynı kalır.
:::

:::model[Varyant matrisi dört parçadan oluşur]
Button'ın base görünümü, izin verilen varyant ve boyut seçenekleri, varsayılan seçimleri ve gerekiyorsa özel kesişimleri tek tabloda düşün. Bu API görünümü seçer; `disabled`, `onClick` ve erişilebilir durum gibi native davranışları button props'ları taşır.
:::

:::model[Etkileşim durumunu iki kanalda göster]
Gerçek durum HTML veya React props'larında bulunur; Tailwind class'ı onu görünür kılar. Favori seçimi `aria-pressed` ile bildirilir, odak görünümü klavyeyle gezinirken de anlaşılır olmalıdır.
:::

:::model[Props aşağı, olaylar yukarı]
Arama değeri üst bileşenden SearchBox'a iner, yazma olayı callback ile geri çıkar. UI kit'in Input'u değeri kendine almaz; MovieCard da favori state'ini sahiplenmez.
:::

Önce temel UI parçalarını kurup kendi küçük önizlemesinde incele. Sonra ekranları birer birer geçir: film kartında kit parçalarının doğru HTML ve props'ları taşıdığını, arama alanında ise mevcut değer ve değişim callback'inin korunduğunu kontrol et. Son olarak klavyeyle dolaş, açık ve koyu temada metin ile zemin ayrımını gözden geçir; görünüm yenilenirken arama ve favori akışlarını da dene.

Sorun gördüğünde katmanları sırayla düşün: tema token'ı mı, `cn` ile class birleştirme mi, Button varyantı mı, yoksa gerçek HTML/React davranışı mı? Böylece görsel düzeltmeyi ürün state'inden ayrı inceleyebilirsin.

## Özet

- Önce UI kit'i kur, sonra MovieCard ve SearchBox'ta kullan.
- Token ve varyantlar görünümü düzenler; native props HTML davranışını korur.
- Arama controlled kalır, favori state'i üst bileşende kalır.
- Klavye odağı, erişilebilir adlar ve açık/koyu tema görünümüyle birlikte akışları da dene.

**Terimler:**

- **Design token:** Renk veya yazı tipi gibi tekrar kullanılan tasarım kararına verilen anlamlı ad.
- **Varyant:** Bir bileşenin izin verilen görünüm seçeneği; örneğin Button'ın `ghost` görünümü.
- **Native props:** Bileşenin temel aldığı HTML öğesinin props'ları ve davranışları.

**Kendini yokla:** UI kit'e geçerken hangi davranışları yeniden denersin? Arama, favori, erişilebilir ad, klavye odağı ve disabled davranışı.
