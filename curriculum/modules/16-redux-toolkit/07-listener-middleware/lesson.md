---
title: "State’i kalıcı kılmak"
minutes: 8
kind: concept
---

# State’i kalıcı kılmak

:::pain[Sinema’da sorun]
Favoriler çalışıyor; sayfayı yenileyince kayboluyor. Her reducer’a `localStorage.setItem` koyunca saf testler bozuluyor.
:::

## Sorunu çöz

`createListenerMiddleware` action’ı gözler; reducer çalıştıktan sonra `listenerApi.getState()` ile yeni state’i okur. localStorage yazımı burada yan etkidir. Başlangıç verisini kontrollü biçimde oku; bozuk JSON için güvenli varsayılan kullan.

## Sinema örneği

Favori toggle sonrası yalnız favori ID’lerini yaz. Sonra watchlist, ui ve recentlyViewed için ayrı key’ler veya sürümlenmiş tek kayıt seçebilirsin.

## Reducer sonrası etki

```ts title="store.ts"
const listener = createListenerMiddleware()
listener.startListening({
  actionCreator: toggleFavorite,
  effect: (_action, api) => {
    const state = api.getState() as RootState
    localStorage.setItem('sinema:favorites', JSON.stringify(state.favorites.ids))
  },
})
const store = configureStore({
  reducer: rootReducer,
  middleware: getDefault => getDefault().prepend(listener.middleware),
})
```

Bu örnekte `RootState`, `rootReducer` ve `toggleFavorite` kendi dosyalarından gelir. Testte `toggleFavorite(550)` sonrası storage’ın `[550]` yazdığını kontrol et. Eski state’i yazarsan ilk tıklamada `[]` çıkar ve hata hemen görünür.

Gerçek projede storage okumasını güvenli yap: JSON bozuksa varsayılana dön. Storage erişimi kapalıysa reducer çalışmaya devam etmeli. Aynı mekanizmayı tema ve listelere genişletirken kayıt biçimini sürümlendirmeyi düşün.

:::mistake[Sık hata]
`localStorage` her ortamda yoktur (SSR/test). Yazma başarısızlığı arayüzü çökertmemeli; üretimde kota ve migration düşün.
:::

:::sector[Sektörde]
Listener middleware olay temelli basit yan etkiler için uygundur; asenkron iptal/orkestrasyon da yapabilir.
:::
