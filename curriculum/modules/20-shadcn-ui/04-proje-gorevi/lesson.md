---
title: "Sinema'ya sahip olduğun UI parçalarını ekle"
minutes: 9
kind: project
---

# Sinema'ya sahip olduğun UI parçalarını ekle

:::pain[Problem]
19. modülde fragman modalını, focus trap'ini ve sekmeleri elle yazdın; çalışıyor. Şimdi ürün ekibi detay sayfasına bir "Film işlemleri" menüsü istiyor: ok tuşlarıyla gezinme, ilk harfe atlama, Escape, dışarı tıklama, focus'u geri verme… Bir de yorum formundaki yıldız düğmeleri aslında tek seçimli bir grup, ama ekran okuyucu onları beş ayrı "basılı/basılı değil" düğme olarak okuyor.
:::

## İki görev
1. **UI parçaları ve detay sayfası.** CLI'ı Radix ile kur (`init -b radix`), `button`, `dialog`, `dropdown-menu`, `input`, `card`, `badge` ekle. Fragman modalını `Dialog`'a taşı, detay sayfasına `DropdownMenu` ile bir "Film işlemleri" menüsü ekle. Eski `src/shared/ui` kitinin yerini yeni parçalar alsın.
2. **Yorum formu.** `form`, `label`, `textarea`, `radio-group` ekle. Sinema'nın yorum formunu kopyalanmış form parçalarıyla yeniden yaz; puan seçimi bir `RadioGroup` olsun.

## Kopyaladığın kod senin
CLI'ın ürettiği dosyaları olduğu gibi bırakmak zorunda değilsin; tam tersine, **okuyup düzenlemen** bekleniyor:
- `DialogContent`'teki kapatma düğmesinin ekran okuyucu metni İngilizce ("Close"). Sinema Türkçe: "Kapat" yap.
- `form.tsx`'teki `FormLabel` bir `<label htmlFor>`; Radix `RadioGroup` bir `div` olduğu için etiket onu adlandıramaz. Gruba ad vermenin yolunu sen seçeceksin.
- Tema: `.dark` sınıfı portal içeriklerini de kapsasın diye `<html>` öğesinde olmalı (2. ders).

## Doğrulama
Testler bileşenleri tek başına ve gerçek detay sayfasını (550 Dövüş Kulübü) render ederek davranışı kontrol eder. Geçtikten sonra tarayıcıda klavyeyle dene: Film işlemleri → Enter → ok tuşları → Enter; Fragmanı aç → Escape; yorum formunda Tab ile puan grubuna gel ve ok tuşlarıyla puan seç. Koyu temada menü ve dialog da koyu açılmalı.

:::sector
shadcn/ui bir bağımlılık değil, bir başlangıç noktası. Takımlar genellikle CLI çıktısını ilk gün kendi tasarım diline uyarlar ve sonrasında dosyaları sıradan kaynak kod gibi test eder. Sonraki modülde bu uçtan uca akışları Playwright ile gerçek tarayıcıda sınayacaksın.
:::
