---
title: "Türetilmiş veriyi seçmek"
minutes: 8
kind: concept
---

# Türetilmiş veriyi seçmek

:::pain[Sinema’da sorun]
İzleme listesindeki favori sayısını her bileşende yeniden filtreliyorsun. Bazı bileşenler yeni dizi üretip gereksiz render oluyor.
:::

## State'ten görünüm türet

Selector, store'daki state'i okuyup bir bileşenin ihtiyacı olan değeri çıkaran fonksiyondur. Basit alan okuması doğrudan yapılabilir; birkaç alandan pahalı veya yeni referans üreten sonuç gerekiyorsa memoization kullanılabilir. Memoization aynı girdilerle aynı sonucu yeniden üretmek yerine önceki sonucu korur.

Controlled input dersinde filtrelenmiş listeyi ayrı state'e kopyalamamayı öğrendin. Sinema'da favori ve izleme listesi kesişimi de saklanmak yerine türetilir. Buradaki yeni nokta, türetilmiş dizinin referansını koruyarak gereksiz component render'ını azaltmaktır.

## Sorunu çöz

Basit alanı doğrudan seç. Slice içindeki `selectors` ile yakın duran kuralları paylaş. Birden çok girdiden pahalı sonuç üretirken `createSelector` kullan; girdilerin referansı aynıysa sonuç referansı korunur.

## Sinema örneği

Favori ID’lerini ve watchlist film ID’lerini kesiştir. Aynı input referanslarıyla ikinci çağrı aynı dizi nesnesini döndürmeli; favoriler değişince yeni sonuç üretilir.

## Ne zaman memoization?

```ts title="selectors.ts"
const selectFavoriteIds = (state: RootState) => state.favorites.ids
const selectSelectedIds = (state: RootState) => state.watchlists.selectedIds
const selectOverlap = createSelector(
  [selectFavoriteIds, selectSelectedIds],
  (favorites, selected) => selected.filter(id => favorites.includes(id)),
)
```

Gerçek dosyada `createSelector` RTK’den, `RootState` ise store’dan import edilir. İlk kod görevindeki `createSlice({ selectors: { ... } })` tek slice’a ait basit boolean okumasıdır. İkinci görev iki slice’ı birleştirir; yeni dizi üretimi ancak girdiler değişince yapılır. Bu tekrar aynı kavramı biraz daha zor bir bağlama taşır.

Memoization doğruluk için zorunlu değildir. Burada faydası sonuç dizisinin referansını korumasıdır: `useSelector` farklı referans görünce bileşeni yeniden render edebilir. Bu yüzden input selector’larında her çağrıda yeni dizi kopyalama.

:::mistake[Sık hata]
Selector içine `state => [...state.favorites.ids]` gibi her seferinde yeni dizi üreten input koyma; memoization bozulur.
:::

:::sector[Sektörde]
Önce ölç, sonra memoize et. Her küçük hesap için createSelector gerekmez.
:::
