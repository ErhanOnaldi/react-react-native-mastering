---
title: "500 film, az DOM satırı"
minutes: 8
kind: concept
---

# 500 film, az DOM satırı

:::pain[Problem]
Filtre hızlı olsa bile 500 `li` tarayıcının yerleşim işini artırıyor. Ekranda 8 film görünürken neden 500 DOM düğümü tutalım?
:::

## Görünen aralık
`useVirtualizer({ count, getScrollElement, estimateSize, overscan })` görünür indeksleri verir. `getTotalSize()` kaydırma alanının yüksekliğini korur; her `virtualItem.start` satırı doğru konuma yerleştirir.

`@tanstack/react-virtual` burada gerçek kurulu pakettir. `key` olarak film id'sini kullan; filtre değişince satır kimliği indeksle karışmasın. Sabit yükseklikli satırlarla başla, değişken yükseklik gerekiyorsa `measureElement` ekle.

:::sector
Sanallaştırma DOM sayısını azaltır; arama algoritmasını veya ağ isteğini hızlandırmaz. Üç sayacı ayrı ayrı izle.
:::

## İndeks ile kimliği ayır

500 öğelik veri, 240 px yükseklikte 40 px satırlarla yaklaşık altı görünür satır demektir. `overscan: 3` yukarı ve aşağı birkaç satır daha hazır tutar. Testte DOM'daki `listitem` sayısı bu yüzden 500 değil, 30'dan az olmalı. Kaydırma alanının toplam yüksekliği yine yaklaşık `500 * 40` px kalır.

Filtre sonucu değişince indeks 0 başka bir filme ait olabilir. `getItemKey: (index) => filtered[index].id` gerçek film kimliğini korur. `virtualizer.getVirtualItems()` yalnız aralıktaki indeksleri verir. Bu satırlara `position: absolute` ve `translateY(row.start)` uygula; aksi halde hepsi üst üste biner. Önizlemede kaydırıp aşağıdaki filmlerin de göründüğünü kontrol et.
