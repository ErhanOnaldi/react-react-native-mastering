---
title: "Davranışı tutarak değiştir"
minutes: 8
kind: concept
---

# Davranışı tutarak değiştir

:::pain[Problem]
Tek hamlede SearchPage’i taşıdın, API yolunu değiştirdin, boş sonuç metnini de yeniledin. Sayfalama bozulduğunda hangi değişimin etkilediğini bilmiyorsun.
:::

## Yapıyı değiştirirken davranışı sabit tut

Refactor, kullanıcıya görünen davranışı değiştirmeden kodun iç düzenini iyileştirmektir. Aynı anda hem yapıyı hem metni hem API sonucunu değiştirirsen hangi adımın hataya yol açtığını bulmak zorlaşır. Önce mevcut sözleşmeyi test veya gözlemle sabitle, sonra küçük bir taşıma yapıp yeniden kontrol et.

Sinema SearchPage'in parçalanması önceki feature ve API client kararlarını uyguluyor. Bu işlemde doğru arama, boş sonuç ve hata ekranları aynı kalmalı. Sonraki Vitest modülü, bu güvenlik ağını senin yazmanı öğretecek.

## İhtiyaçtan karar

Önce mevcut davranışı ölç: başarılı sonuç, boş sonuç, 404 ve sayfa parametresi. Sonra tek sorumluluğu ayır, testleri tekrar çalıştır. Refactor kullanıcı davranışını değiştirmez.

## Sinema’da dene

Bu dersteki spagetti starter çalışıyor. Önce yeşil davranış testlerini gör; ardından aynı çıktıyı koruyarak ortak biçimlendirmeyi çıkar. Rubric, testlerin göremediği okunurluğu da değerlendirir.

## Önce ölç, sonra ayır

Bu dersteki `describeMovie` üç dalda aynı tarih hesabını yapıyor. Üç etiketin de çıktısı doğru; başlangıç davranış testleri bu yüzden yeşil. Önce bu testleri oku ve çıktıyı sabitle. Ardından `formatMovieYear` birimini çıkar: boş tarih, normal tarih ve üç etiket yine aynı sonucu vermeli. Yeni birimin testi başlangıçta kırmızı, refactor sonunda yeşil olur.

Sıra önemlidir: önce davranışın fotoğrafı, sonra tek küçük taşıma, sonra aynı testler. Aynı adımda metni de değiştirirsen bir test hatasının refactor’dan mı yeni özellikten mi kaynaklandığını ayıramazsın. Testler görünür çıktıyı korur; rubric tekrarın gerçekten azalıp azalmadığını değerlendirir.

:::mistake[Sık hata]
Test yeşili, mimarinin iyi olduğunu tek başına kanıtlamaz. Kod incelemesinde tekrar, bağımlılık yönü ve anlamlı adlara da bakılır.
:::

:::sector[Sektörde]
Sonraki modülde testleri sen yazacaksın. Şimdilik var olan testler güvenlik ağı; değişimi küçük tut.
:::
