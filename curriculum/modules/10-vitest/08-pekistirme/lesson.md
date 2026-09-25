---
title: "Güvenlik ağı kur"
minutes: 9
kind: practice
---

# Güvenlik ağı kur

:::pain[Sinema’da ne oldu?]
Sinema refactor’undan sonra üç sınıf hata vardı: sayfalama sınırı kaydı, API hata ayrıntısı kayboldu, arama isteği yetkisiz veya yanlış sayfayla gitti. Bunları tek bir “çalışıyor” testi yakalayamaz.
:::

## Sorunu nasıl görürsün?

Bugün her sınırda aynı döngüyü uygulayacaksın: beklenen davranışı yaz, doğru implementation’da geçir, hatalı sürümde kır. Mutation görevi yanlış davranışları gösterir; testin görevi bunu kullanıcı sözleşmesinden yakalamaktır.

## Uygulama

Önce 41 filmde `page=2` dilimini ölç; sonra 404’ün `ApiError` ayrıntılarını ve arama isteğinin `page=2`, Bearer ve boş sorgu davranışını ayrı senaryolarda denetle. Böylece `it.each`, matcher ve mock aynı kullanıcı akışının farklı sınırlarını korur. Önceki dersteki timer testi ise aramanın ne zaman başlaması gerektiğini güvenceye alır.

## Sık hata

:::mistake
Mutantın içindeki belirli satıra bakarak assertion yazma. Aynı bug farklı kodla oluştuğunda da test kırılmalı.
:::

:::sector
Mutation testi, yalnızca kapsam sayısını değil assertion’ın hata yakalama gücünü de ölçer.
:::
