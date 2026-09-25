---
title: "Tek store, küçük slice’lar"
minutes: 9
kind: concept
---

# Tek store, küçük slice’lar

:::pain[Sinema’da sorun]
Beş provider’ı tek bir Context nesnesine topladın; güncelleme sınırı hâlâ bulanık. Favori ekleme kuralı da üç bileşene kopyalandı.
:::

## Sorunu çöz

`configureStore` reducer’ları ve geliştirme varsayılanlarını kurar. `createSlice` state, reducer ve action creator’ı birlikte üretir. `combineSlices` birden çok slice’ı açıkça birleştirebilir. Önce saf reducer’ı sınayacağız; sonra store’a bağlayacağız.

## Sinema örneği

Favori state’i yalnız ID dizisi tutar. `toggleFavorite(550)` ilk çağrıda ekler, ikinci çağrıda çıkar. Watchlist için ayrı slice kullan; film detay nesnelerini oraya kopyalama.

## Bir eylemi izle

```ts title="favoritesSlice.ts"
const favoritesSlice = createSlice({
  name: 'favorites',
  initialState: { ids: [] as number[] },
  reducers: {
    toggleFavorite(state, action: PayloadAction<number>) {
      const id = action.payload
      const index = state.ids.indexOf(id)
      if (index === -1) state.ids.push(id)
      else state.ids.splice(index, 1)
    },
  },
})
```

Burada `PayloadAction` import’u örneğin bir parçasıdır: gerçek dosyada `import { createSlice, type PayloadAction } from '@reduxjs/toolkit'` yaz. `toggleFavorite(550)` bir action nesnesi üretir. Store bunu reducer’a verir; reducer başka bir state sonucu oluşturur. Bu işlem TMDB isteği yapmaz.

İkinci kod görevinde tema slice’ını da aynı store’a katacaksın. `combineSlices(favoritesSlice, uiSlice)` kökte `favorites` ve `ui` alanlarını kurar. Böylece izleme listesi gelince üçüncü bir provider katmanı yerine bir slice ekleyebilirsin.

:::mistake[Sık hata]
Reducer içinde ağ çağrısı veya localStorage yazımı yapma. Aynı state ve action aynı sonucu vermeli.
:::

:::sector[Sektörde]
Büyük ekipte slice sınırları özellik sorumluluğunu görünür kılar.
:::
