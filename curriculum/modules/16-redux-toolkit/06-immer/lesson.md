---
title: "Reducer’da okunur güncelleme"
minutes: 7
kind: concept
---

# Reducer’da okunur güncelleme

:::pain[Sinema’da sorun]
Son bakılan filmleri başa almak için eski diziyi doğrudan değiştirmek istedin; reducer dışındaki eski snapshot da etkilenmesin.
:::

## Sorunu çöz

RTK `createSlice` reducer’ları Immer draft’ı üzerinde çalışır. `state.ids.unshift(id)` yazabilirsin; gerçek eski state değişmez. Tek reducer’da hem draft’ı değiştirip hem farklı state dönme.

## Sinema örneği

Son bakılan ID’yi önce çıkar, başa koy, son beşi tut. Tekrarlanan film yeniden öne gelir. Önceki state referansının dizisi aynı kalır.

## Üç durum, tek reducer

```ts title="recentlyViewedSlice.ts"
viewMovie(state, action: PayloadAction<number>) {
  state.ids = state.ids.filter(id => id !== action.payload)
  state.ids.unshift(action.payload)
  state.ids = state.ids.slice(0, 5)
}
```

Gerçek dosyada `PayloadAction` tipini RTK’den import et. `550, 603, 155` sırasından tekrar `603` açarsan yeni sıra `603, 550, 155` olur. Altıncı farklı filmi açarsan en eski ID düşer. Bu kuralı component içinde `useEffect` ile yürütürsen farklı sayfalar aynı işi farklı yapabilir; slice reducer’ında tek tanım bulunur.

Immer sayesinde kod mutable görünür ama eski state snapshot’ı korunur. Eski diziyi testte `expect(old.ids).toEqual(...)` ile kontrol et. Bu, React’in immutable state ilkesinin Redux bağlamındaki yeni tekrar basamağıdır.

:::mistake[Sık hata]
Reducer içinde `Date.now()` gibi gizli girdiler kullanmak tekrar üretilebilirliği azaltır; zamanı action payload’ına koy.
:::

:::sector[Sektörde]
Saf reducer testleri kısa ve hızlıdır; UI kurmadan sıralama kuralını kanıtlarsın.
:::
