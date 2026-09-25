---
title: "Başarılı POST, eski liste"
minutes: 7
kind: concept
---

# Başarılı POST, eski liste

:::pain[Problem]
POST 201 ve “Kaydedildi” yazısı geldi. Puanladıklarım sayfasına dönünce hâlâ “Henüz puan yok” görüyorsun. `requests()` yalnızca bir eski GET ve bir yeni POST sayıyor: liste için **yeni GET yok**.
:::

## Cache neden kendiliğinden değişmez?

`useMutation`, hangi query’lerin yazmadan etkilendiğini bilemez. `['ratings', sessionId]` listesi ile `['movies', 'detail', 550]` başka key’lerdir. Başarılı POST, bu cache girdilerini otomatik güncellemez. `staleTime` dolmasını beklemek bile görünür ve güvenilir bir çözüm değildir.

```ts
const before = queryClient.getQueryData(['ratings', sessionId])
await rateMovie({ movieId: 550, value: 8.5 })
const after = queryClient.getQueryData(['ratings', sessionId])
// before ve after aynı eski listedir: yalnızca POST atıldı.
```

Bu örnek cache kopukluğunu gösterir; adlar önceki görevde kurulan fonksiyonlara dayanır.

## İlk düzeltme: invalidation

`onSuccess` içinde `queryClient.invalidateQueries({ queryKey: ['ratings', sessionId] })` çağır. Bu key altındaki query stale olur; aktif observer varsa hemen yeniden fetch edilir. Bu, sunucuyu doğru kaynak olarak kabul eder. `onSuccess` callback’inden Promise döndürmek, mutation’ın pending durumunu yeniden fetch bitene dek korur.

## Daha dar bir ihtiyaç: setQueryData

Bazen elinde yeni veri zaten vardır ve ek GET bekletmek istemezsin. `setQueryData(queryKey, old => next)` cache’i **immutable** günceller. Ancak bir listeyi elle birleştirirken sayfalama, sıralama ve sunucu alanları gibi ayrıntıları yanlış temsil edebilirsin. O yüzden ilk tercih genellikle invalidation; hemen görsel tepki gereken küçük ve kesin değişiklikte cache yazımıdır.

:::mistake
`invalidateQueries()` filtresiz çağrıldığında ilgisiz bütün query’ler de stale olur. Puanlama için rating listesini ve gerekiyorsa ilgili film detayını hedefle.
:::

:::sector
Network sekmesinde POST → GET sırasını ve `requests('/3/guest_session/…/rated/movies')` sayısını izle. “Başarı mesajı çıktı” tek başına tutarlılık kanıtı değildir.
:::
