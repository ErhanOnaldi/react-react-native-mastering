---
title: "Acı günlüğüne geri dön"
minutes: 8
kind: review
---

# Acı günlüğüne geri dön

:::pain[Problem]
Sinema v1’de `/search?q=Matrix` açıldığında bir GET gördün. Detaya gidip geri dönünce aynı URL ikinci kez istendi. `NOTES.md` bunu kaydetti; artık sayıyla konuşabiliriz.
:::

## Önce say

Production benzeri bir akışta arama → detay → geri: `requests('/3/search/movie')` uzunluğu **2**. Aynı akışın Query’li kapanış testinde beklenti **1** olacak. Her `SearchPage` mount’unda effect yeniden başlar. `useDebounce` yazma sırasındaki istekleri azaltır; daha önce alınmış cevabı saklamaz. `AbortController` eski isteği iptal eder; bitmiş cevabı paylaşmaz.

Bir sonraki dersin canlı önizlemesinde 550 → 27205 → 550 akışını istek sayacıyla izle. Cache eklenmeden önce aynı detaya dönüşte sayaç artardı. Geliştirmedeki `StrictMode` ek effect çalıştırabilir; iki yöntemi karşılaştırırken aynı koşulları kullan.

## Sorunu ayır

Dört sayfada kopya `loading/error/data` state’i bir bakım sorunu. Aynı URL’ye tekrar GET gitmesi ise cache eksikliği. Bugün sunucu verisini bileşenin ömründen uzun saklamaya ihtiyacın var. URL’deki `q` hâlâ paylaşılabilir state; favori butonunun durumu hâlâ client state.

:::sector
İstek ölçerken toplam GET, eşsiz URL ve kullanıcı akışını birlikte yaz. "Yavaş" yerine "geri dönüşte 1 fazladan GET" bir iyileştirmeyi doğrulamayı sağlar.
:::
