---
title: "Test neden şimdi gerekli?"
minutes: 7
kind: concept
---

# Test neden şimdi gerekli?

:::pain[Sinema’da ne oldu?]
Arama sayfasında `?page=2` açıldığında birinci sayfanın filmleri tekrar göründü. Refactor yeşil build ile bitti; hata iki gün sonra kullanıcı tarafından bulundu.
:::

## Testin koruduğu şey

Test, bir girdiye veya kullanıcı eylemine karşı beklenen davranışı otomatik denetleyen çalıştırılabilir örnektir. TypeScript bir değerin biçimini kontrol eder; test ise doğru biçimdeki değerin doğru sonuç üretip üretmediğine bakar. İkisi birbirini tamamlar. Testin değeri, değişiklikten sonra daha önce çalışan davranışın bozulduğunu görünür kılmasındadır.

Sinema'da `page` hâlâ sayı olabilir ama yanlış sayfa seçilebilir. Bu, tip hatası değil davranış hatasıdır. Önce küçük saf fonksiyonları test edeceksin; sonra React ekranı, ağ isteği ve bütün kullanıcı akışına kadar kapsam büyüyecek.

## Sorunu nasıl görürsün?

Tip kontrolü `page` değerinin number olduğunu bilir; yanlış sayfanın seçildiğini bilemez. Eski yöntemin elle gezinip bakmaktı. Her değişiklikten sonra arama, filtre, detay ve hata sayfalarını tek tek açmak hem yavaştır hem de unutulabilir.

## Uygulama

Test, belirli bir girdi ve durum için gözlenebilir sonucu kaydeder. `page=2` geldiğinde istek URL’sinde `page=2` olmalı ve ikinci sayfanın verisi görünmeli. Bu, refactor öncesi ve sonrası aynı davranışın korunduğunu hızlıca söyler.

## Sık hata

:::mistake
Fonksiyonun içindeki değişken adlarına bakmak davranışı garanti etmez. Tek bir mutlu yol da `page=2` hatasını yakalayamaz.
:::

:::sector
Özellikle geçmişte kırılmış bir akışı yeniden üretmek, sonraki refactor’lar için en değerli regresyon testidir.
:::
