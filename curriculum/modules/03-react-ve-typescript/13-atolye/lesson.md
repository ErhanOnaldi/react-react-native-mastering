---
title: "Atölye: state ve bileşen API'si"
minutes: 6
kind: practice
---

# Atölye: state ve bileşen API'si

İlk alıştırmada popüler filmleri Türkçe başlığa göre sıralar ve favorileri sıralama boyunca aynı filmlerde tutarsın. İkincisinde başlık filtresi kurar, tekrar kullanılabilir panelin nasıl yapılandırılacağına karar verirsin.

:::model[Ağaçta kimlik ve key]
Liste sırası görünüm bilgisidir; id filmin kimliğidir. Favorileri id'lerle sakla ve her satıra sabit id'den `key` ver. Böylece sıralama, favori durumunu başka satıra taşımaz.
:::

:::model[Composition]
Composition, bileşenleri içerik vererek bir araya getirmektir; `children` bunun yaygın yoludur. Bu atölyede tek bir yapılandırma prop'u daha küçük bir API sunabilir, ayrı içerik parçaları ise farklı yerleşimler için esneklik verir. Seçimini panelin kaç farklı biçimde kullanılacağını düşünerek yap ve somut ödünleşimi kod yorumunda belirt.
:::

## Davranışı önce görünür kıl

Favorileri işaretledikten sonra sırayı ters çevir. İşaretlerin aynı filmlerle kalıp kalmadığını ve tek favoriyi kaldırınca diğerinin durduğunu kontrol et. Kaynak listeyi yerinde sıralama; kopya listeyi Türkçe başlıklara göre sırala.

Filtre panelinde “Film ara” alanının etiketi ve değeri açık olsun. Büyük/küçük harf farkı aramayı bozmamalı; Türkçe harfler de eşleşmeli. Alan temizlenince bütün filmlerin geri geldiğini dene. Panel belirli film adlarını kendi içine gömmemeli.

## Özet

- Film id'siyle state tut; sıra index'ini kimlik olarak kullanma.
- Sıralanmış görünümü yeni dizi olarak üret.
- Component API'sini gerçek kullanım biçimine göre seç ve ödünleşimi açıkla.

**Kendini yokla:** Filtre panelinin tasarımı için tek doğru API var mı?
*Cevap:* Hayır; kullanım biçimine uyan seçeneği seçip maliyetini gerekçelendirmek gerekir.
