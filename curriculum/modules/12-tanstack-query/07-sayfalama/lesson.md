---
title: "Sayfalama"
minutes: 8
kind: concept
---

# Sayfalama

:::pain[Problem]
Aramada `?page=1` → `?page=2` yaptığında liste bir an boşalıp yükleme ekranına dönüyor. Kullanıcı önceki filmleri okurken düğme ve içerik zıplıyor.
:::

## Sayfa değişirken iki zaman dilimi

Sayfalama, tek büyük listeyi farklı veri parçaları hâlinde okumaktır. Her sayfa ayrı query key'iyle saklanır; sayfa numarası değişince yeni bir istek gerekir. Eski sayfa verisini yeni sonuç gelene kadar geçici göstermek, arayüzdeki sıçramayı azaltabilir. Ancak gösterilen eski verinin yeni sayfaya ait olmadığı kullanıcıya açık kalmalıdır.

Router'da `page` URL'nin parçasıydı; burada cache kimliğinin de parçası olur. Sinema'daki liste boşalması, verinin değiştiği kısa bekleme anından kaynaklanır. `placeholderData` o anı yönetir; gerçek yeni sayfa geldiğinde sonuç kendi cache girdisinden okunur.

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
