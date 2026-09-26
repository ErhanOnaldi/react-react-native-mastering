---
title: Immutability
minutes: 9
kind: concept
---

# Immutability

:::pain[Problem]
Sinema’da `favoriteIds.push(movie.id)` yaptın, sonra `setFavoriteIds(favoriteIds)` çağırdın. Diziye bakınca id var; ama karttaki “Favoride” işareti güncellenmedi.
:::

## Değişikliği yeni değerle bildir

Immutability, mevcut dizi veya nesneyi yerinde değiştirmeden, güncellenmiş yeni bir değer üretme ilkesidir. React state güncellemelerinde bu önemlidir; eski referansın içine `push` yapmak değişimi güvenilir biçimde bildirmez. Yeni dış nesneyi üretirken değiştirdiğin iç nesneyi de kopyalaman gerekir.

State snapshot'ı önceki render'ın verisidir. Onu sonradan mutasyona uğratırsan eski ve yeni render'ın neyi gördüğü belirsizleşir. Sinema favorileri bunun görünür örneği; aynı kural form verisinde, reducer'larda ve önbelleğe alınmış nesnelerde de işe yarar.

## Yeni referans üret
React state’i eski ve yeni değerleri karşılaştırır. Aynı dizi nesnesini geri vermek değişim sinyali değildir. Eklemede spread, çıkarmada `filter`, tek nesne değiştirmede `map` + object spread kullan.

```tsx check
const before = [550, 155]
const added = [...before, 603]
const removed = added.filter(id => id !== 155)
void removed
```

Bu modüldeki canlı önizlemede önce `push` hatasını tıkla; ardından yeni dizi döndürüp sonucu izle. İki hızlı tıklamada da doğru çalışması için güncellemeyi önceki değeri alan callback içinde hesapla.

Nesne güncellemesinde yalnızca dış diziyi kopyalamak yetmez. İçindeki bir filmi değiştireceksen `{ ...movie, vote_count: movie.vote_count + 1 }` ile o nesneyi de yenile. Değişmeyen filmler aynı nesne kalabilir.

:::mistake
`movies.sort(...)` de orijinal diziyi değiştirir. Sıralı görünüm için `[...movies].sort(...)` kullan; `toSorted` destekleyen ortamda o da uygundur.
:::

:::sector
Immutable güncelleme, React’in render kararını ve ilerideki hata ayıklama araçlarını öngörülebilir tutar.
:::
