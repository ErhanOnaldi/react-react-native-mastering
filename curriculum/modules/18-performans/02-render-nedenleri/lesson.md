---
title: "Render nedenlerini ayır"
minutes: 8
kind: concept
---

# Render nedenlerini ayır

:::pain[Problem]
Aramaya yazdığında hem input hem değişmeyen film rozeti tekrar çalışıyor. Listeyi hızlandırmadan önce hangi state'in kimi etkilediğini bulmalısın.
:::

## Render zinciri
Bir bileşenin state'i değişince kendisi yeniden render edilir. Varsayılan olarak çocukları da yeniden çağrılır. Context değeri değişirse onu okuyan bileşenler etkilenir. Yeni bir `key`, eski bileşeni korumaz; yeniden oluşturur.

## Küçük deney
Arama state'ini yerel tut, `Profiler` ile listeyi izle. Sonra üst seviyeye taşı: aynı tuş daha geniş ağacı çalıştırır. Kaynağı bilmeden `memo` eklemek gürültüyü gizler.

:::mistake
Render ile DOM değişikliği aynı şey değildir. React bileşen fonksiyonunu tekrar çağırabilir ama aynı DOM'u koruyabilir.
:::

## Üç nedeni ayrı dene

| Değişen şey | Beklenen etki |
|---|---|
| Arama inputunun yerel state'i | Input bileşeni yeniden çalışır. |
| Üst bileşenin state'i | Üst bileşen ve varsayılan olarak çocukları yeniden çalışır. |
| Context değeri | O context'i okuyan tüketiciler güncellenir. |

`memo` yalnız aynı props ile gelen çocuğa yardımcı olabilir. Çocuk context okuyorsa context değişimi yine ona ulaşır. Ayrıca `key={Math.random()}` gibi kararsız kimlik, eski bileşenin korunmasını bozar. Bu nedenle önce state'in sahibi, sonra props ve key akışı incelenir. `onRender` callback'ini `vi.fn` ile saymak, hangi panelin gerçekten yeniden çağrıldığını gösterir.
