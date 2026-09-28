---
title: "Erişilebilir component sınırları"
minutes: 5
kind: practice
---

# Erişilebilir component sınırları

:::pain[Belirti]
Çalışan bir seçim ekranını ikinci sayfada da kullanman isteniyor. Klavye dolaşımını ve seçimi bozmadan yeniden kullanım sağlamalısın. Bir sonraki görevde aynı seçim kontrolünü iki farklı API ile kurup hangisinin yeni seçenek eklemeyi kolaylaştırdığına karar vereceksin.
:::

Bu atölyede karar alanı daha geniş. İlk görevde seçim davranışını iki sayfada tekrar kullan; her sayfanın seçimi bağımsız kalmalı ve sayfalar arası geçişte korunmalı. İkinci görevde yapılandırma listesi ile birlikte kullanılan küçük parçalar arasından seçim yap. Her iki tasarım da erişilebilir isim, ok tuşları ve ilişkili hata mesajı sağlamalı.

## Kararı gerekçelendir

İlk görevde paylaşılacak parçanın hangi veriyi alması gerektiğini belirle. Seçenekler, seçili değer ve değişiklik callback'i ortak panelin girdisi olabilir; sayfaya özgü seçilmiş değeri ortak parçanın içine saklamak iki sayfanın state'ini birbirine bağlar. Klavye davranışı aynı bileşende tutulduğunda güncelleme tek noktadan yapılır.

İkinci görevde kod yorumunda seçtiğin API biçiminin bakım etkisini açıkla. Tek bir kayıt listesi yeni seçenek eklemeyi kolaylaştırabilir; compound API ise çağırana içerik yerleşiminde esneklik verebilir. Hangisinin daha uygun olduğu kullanım sayısına ve seçeneklerin ne kadar değiştiğine bağlıdır. Gerekçen “daha temiz” gibi genel bir söz değil, örneğin yeni bir seçenek eklemek için gereken değişiklik sayısı olmalı.

Her iki görevde de klavyeyle deneyerek başla: Tab ile seçili öğeye gel, ok tuşlarıyla seçim yap, Home/End davranışını kontrol et. Hata durumunda mesajı görmenin yanında seçim alanından o mesaja programatik bir ilişki olup olmadığını da incele. Bir sorunda takılırsan önce beklenen kullanıcı davranışını kendi cümlenle anlat; ardından bu davranışı sağlayacak React ve ARIA araçlarını seç.

:::sector
Bir component API'si yalnızca bugün render ettiği DOM'u değil, yarın eklenebilecek seçeneklerin bakım maliyetini de belirler. Tasarım sistemleri bu nedenle klavye ve erişilebilirlik davranışını ortaklaştırırken uygulamaya yeterli kompozisyon esnekliği bırakır.
:::

## Özet

- Paylaşılan UI davranışını sayfaya özgü seçilmiş değerden ayır.
- Klavye dolaşımı iki kullanım yerinde aynı kalmalı.
- API seçimini bakım ve genişleme maliyetiyle açıkla.
- Hata metni görünür olmalı ve ilgili kontrolle bağlanmalı.
