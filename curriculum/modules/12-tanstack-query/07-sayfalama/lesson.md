---
title: "Sayfalama"
minutes: 8
kind: concept
---

# Sayfalama

:::pain[Problem]
Aramada `?page=1` → `?page=2` yaptığında liste bir an boşalıp yükleme ekranına dönüyor. Kullanıcı önceki filmleri okurken düğme ve içerik zıplıyor.
:::

## Önceki sayfayı geçici göster

URL’deki `page` sayısını key’e koy. TanStack Query 5’te `placeholderData: keepPreviousData` kullanırsan yeni sayfa gelirken eski sayfa **geçici** gösterilir. `isPlaceholderData` true iken "Sonraki" butonunu kapatabilir veya "Yeni sayfa yükleniyor" yazabilirsin.

```ts check title="src/pagination.ts"
import { keepPreviousData } from '@tanstack/react-query'

export const paginationOptions = { placeholderData: keepPreviousData }
```

Bu veri yeni sayfanın cache girdisine kalıcı kopyalanmaz. Yeni cevap geldiğinde `data.page` ve filmler değişir. `?page=` değeri geçersizse 1’e dön; negatif sayfayı API’ye yollama.

:::sector
`keepPreviousData` v5’te `placeholderData` fonksiyonudur. Eski `keepPreviousData: true` seçeneğini kullanma.
:::
