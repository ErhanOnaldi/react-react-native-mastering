---
title: "Tipli dispatch ve selector hook’ları"
minutes: 7
kind: concept
---

# Tipli dispatch ve selector hook’ları

:::pain[Sinema’da sorun]
Film kartında `useSelector` kullandın; `state` tipi belirsiz kaldı, her dosyada RootState yazmaya başladın.
:::

## Sorunu çöz

Store’dan `RootState = ReturnType<typeof store.getState>` ve `AppDispatch = typeof store.dispatch` türet. React Redux 9.3’te `useDispatch.withTypes<AppDispatch>()` ve `useSelector.withTypes<RootState>()` ile uygulama hook’larını bir kez oluştur. `Provider` store’u bileşen ağacına verir.

## Sinema örneği

Bir bileşen yalnız `state.favorites.ids` seçerse `ui.theme` güncellemesi selector sonucunu değiştirmez. Render sayacını bu sınırda ölç.

## Abonelik sınırı

```ts title="src/app/store.ts"
export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
export const useAppDispatch = useDispatch.withTypes<AppDispatch>()
export const useAppSelector = useSelector.withTypes<RootState>()
```

Gerçek dosyada React Redux’tan `useDispatch` ve `useSelector` import edilir. Hook çağrısını bileşen içinde yap; yukarıdaki satırlar yalnız tipli hook *oluşturur*. Bileşende `useAppSelector(state => state.favorites.ids.includes(movieId))` boolean döndürür. Tema güncellenince bu boolean aynı kaldığı için favori tüketicisinin yeniden render edilmesi gerekmez.

Kod görevindeki önizlemede favori butonu ve **Tema render sayacı** yan yana. Favori butonuna basınca tema sayacının artmaması gerektiğini kendi gözünle gör. Ardından tema action’ında temanın güncelleneceğini düşün: dar seçim yanlış alanı dondurmaz, sadece alakasız değişimi dışarıda bırakır.

:::mistake[Sık hata]
`useSelector(state => ({ ids: state.favorites.ids }))` her çağrıda yeni nesne döndürür. Varsayılan eşitlik referansa bakar; önce alanı doğrudan seç.
:::

:::sector[Sektörde]
`connect` hâlâ çalışsa da React Redux 9.3’te deprecated işaretlidir; yeni kodda hook kullan.
:::
