---
title: "Kitaplık bağlamında bağımsızlık"
minutes: 8
kind: practice
---

# Kitaplık bağlamında bağımsızlık

:::pain[Problem]
Film verisiyle çözdüğün her şey (URL, cache, bağımlı sorgular, sınır kararları) burada başka bir gerçek API'yle, Open Library'yle karşına çıkıyor. Kitap araması sayfalanınca geri tuşu eski sonucu unutuyor; eser değişince yazar bilgisi bir önceki kitapta kalıyor.
:::

Bu son Atölye'de yöntem tamamen sana ait; verilen sadece iş gereksinimi ve testlerin açtığı bileşen. Mimari görevlerde `projects/atolye` içinde çalış, kurduğun ekranı uygulamadan aç ve bitince "AI review prompt'unu kopyala" düğmesiyle kontrol ettir.

Görevler: kitap arama ve sayfalamada geri dönüş; eser değişince yazarın doğru güncellenmesi; kişisel okuma listesiyle bir keşif ekranı; iki sınır arasında seçim yapıp kararını kaydetme.
