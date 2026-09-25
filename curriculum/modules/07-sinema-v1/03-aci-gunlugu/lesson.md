---
title: "Acı günlüğü"
minutes: 7
kind: review
---

# Acı günlüğü

:::pain[Problem]
Sinema artık canlı, fakat aramadan detaya gidip geri dönünce Network sekmesinde aynı GET tekrar beliriyor. Home, Search, Details ve Favorites sayfalarında benzer loading/error dalları var. Çalışan uygulamanın bu maliyetini görünür kılma zamanı.
:::

## Bir akışı say

Production benzeri, `StrictMode` çift effect çalıştırması olmadan düşün: `/search?q=Matrix` sayfası açıldığında bir arama GET'i gider. Detay sayfasına geçince arama bileşeni unmount olur. Geri dönünce tekrar mount edilir; component state'i ve effect'i yeniden başlar. Cache yoksa aynı arama GET'i **ikinci kez** gider. Geliştirme `StrictMode`'unda daha fazla istek görebilirsin; bu ayrı bir etki.

`useDebounce` hızlı yazarken istekleri azaltır ama önceki başarılı cevabı saklamaz. `AbortController` veya cleanup, eski cevabın yanlış ekrana yazılmasını önler; gidip gelince veriyi yeniden kullanmaz. Bunu Network sekmesinde `requests()` mantığıyla say: toplam istek ile eşsiz URL sayısı aynı şey değil.

## Kod tekrarını işaretle

Bir sayfada `loading`, `error`, `data` için state ve koşullu render yazdın. Diğer endpoint yeni bir cevap biçimi getirince aynı akışı yine yazdın. Aynı sınırların kaç yerde olduğuna bak. Hata gövdesi ekranda düzgün mü? Boş `results` ile HTTP hatasını karıştırıyor musun?

## Bir sonraki adım için kanıt

`NOTES.md` içinde **gözlem → nasıl tekrarlanır → muhtemel neden → kullanıcı etkisi** düzenini kullan. Özellikle detayda rota id'si değişirken eski film kalıyorsa bunu kaydet. Modül 8 dependency hatasını lint ile, sonraki modüller tekrar kodu ve istekleri farklı araçlarla ele alacak.

:::sector
Bir araç seçmeden önce sorunu ölçmek ekip içinde daha iyi bir tartışma sağlar. "Uygulama yavaş" yerine "aramaya geri dönünce aynı URL ikinci kez çağrılıyor" demek doğrulanabilir bir gözlemdir.
:::
