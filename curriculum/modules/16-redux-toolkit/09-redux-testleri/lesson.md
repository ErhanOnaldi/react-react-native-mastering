---
title: "Reducer ve bileşeni sınamak"
minutes: 8
kind: practice
---

# Reducer ve bileşeni sınamak

:::pain[Sinema’da sorun]
Mock `useSelector` ile test yeşil; gerçek Provider altında favori tıklaması state’i değiştirmiyor. Mock aradaki bağlantıyı sakladı.
:::

## Sorunu çöz

Reducer’ı `(state, action)` ile doğrudan sınayabilirsin. Bileşeni `Provider store={setupStore(preloadedState)}` altında render et ve gerçek kullanıcı eylemiyle sonucu ölç. Her test yeni store kurmalı.

## Sinema örneği

Bir test ilk state’e `550` yükler ve butonun “Favoriden çıkar” olduğunu görür. Başka test boş state’le başlar, “Favorilere ekle”ye tıklar ve ardından “Favoriden çıkar”ı görür.

## İki test katmanı

```ts title="favoritesSlice.test.ts"
const previous = { ids: [550] }
const next = favoritesSlice.reducer(previous, toggleFavorite(603))
expect(next.ids).toEqual([550, 603])
expect(previous.ids).toEqual([550])
```

Bileşende ise gerçek Redux bağlantısını sınarsın:

```tsx title="FavoriteButton.test.tsx"
const store = setupStore({ favorites: { ids: [550] } })
render(<Provider store={store}><FavoriteButton movieId={550} /></Provider>)
expect(screen.getByRole('button', { name: 'Favoriden çıkar' })).toBeInTheDocument()
```

Buradaki `setupStore(preloadedState)` proje görevinin export sözleşmesidir. Test dosyasında gerekli `vitest`, RTL ve React Redux import’larını ekle. İlk test saf kuralı, ikincisi Provider bağlantısını yakalar. `useSelector` mock’u ikinci katmanı geçersiz kılar: gerçek store ile görünür davranışı izle.

:::mistake[Sık hata]
Paylaşılan singleton store testler arası sızıntı üretir. Preloaded state’in yalnız gereken kısmını ver; testler kullanıcı davranışını anlatsın.
:::

:::sector[Sektörde]
Modül 11’deki RTL sorgularını ve Vitest `expect` kullanımını burada yeni bir bağlamda tekrarlıyorsun.
:::
