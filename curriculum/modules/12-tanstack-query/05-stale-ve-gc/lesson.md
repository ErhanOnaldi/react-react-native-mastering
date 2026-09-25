---
title: "staleTime ve gcTime"
minutes: 8
kind: concept
---

# staleTime ve gcTime

:::pain[Problem]
Cache ekledin ama aramaya geri dönünce ağda yine GET var. Çünkü cache’deki veri anında stale kabul ediliyor.
:::

## İki ayrı saat

`staleTime`, veri ne kadar süre **taze** kabul edilecek sorusunu yanıtlar. Taze cache’e yeniden abone olunca varsayılan mount refetch’i çalışmaz. `gcTime`, son abone ayrıldıktan sonra kullanılmayan cache girdisinin ne zaman silineceğini belirler. `staleTime: 60_000, gcTime: 300_000` ile 30 saniye sonra dönmek taze veriyi yeniden kullanır; 90 saniye sonra dönmek eski veriyi hemen gösterip arka planda yenileyebilir; uzun süre kimse kullanmazsa girdi silinir.

`staleTime` bir saklama süresi değildir. `gcTime` verinin tazeliğini belirlemez. `Infinity` tazeliği elle invalidation’a dek uzatabilir; TMDB trend listesi için sınırsız tazelik doğru olmayabilir.

## Durumları ayır

İlk açılışta `isPending` boş ekrandır. Cache’de eski veriyle yeni istek sürerken `isFetching` true, `isPending` false olabilir. Bu ayrımı kullanıcıya "Yenileniyor" yazarken kullan.

:::sector
Süreleri endpoint’e göre seç: tür adları seyrek, trend listesi sık değişir. Önce `requests()` ile tekrar istek sayısını ölç, sonra tazelik süresini gerekçelendir.
:::
