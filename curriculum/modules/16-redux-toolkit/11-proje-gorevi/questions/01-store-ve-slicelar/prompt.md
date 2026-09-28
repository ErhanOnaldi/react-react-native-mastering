Sinema’daki ortak kullanıcı tercihlerini tek client state akışında tut. Favori etkileşiminde alakasız tema bileşeni güncellenmemeli.

## Gereksinimler

- Favori ekleme/çıkarma aynı kimlik üzerinde tekrarlandığında doğru sonuç verir; TMDB film nesneleri store’a kopyalanmaz.
- Watchlist oluşturulabilir; aynı film listeye yinelenmeden eklenir.
- Tema ve son bakılan kayıtlar bağımsız alanlarda tutulur; son bakılanlar en yeni başta ve en fazla beş kimliktir.
- `setupStore()` her çağrıda yeni store kurar; uygulamanın varsayılan `store` export’u bulunur.
- Store state ve dispatch tipleri uygulamanın reducer’larıyla uyumludur; tipli hook’lar sağlar.
- Provider zinciri Redux bağlantısıyla değiştirilirken Query provider ve mevcut kullanıcı davranışları çalışır.
- Favori değişikliği ilgisiz tema tüketicisinin render’ını artırmaz.

## Örnek

550 ve 603’ü favoriye ekleyip 550’yi çıkarınca favori listesi `[603]` kalır. Watchlist’e aynı filmi iki kez eklemek tek kayıt üretir.

## Sözleşme

| Dosya | Zorunlu export ve davranış |
| --- | --- |
| `src/app/store.ts` | `store`, `setupStore(preloadedState?)`, `RootState`, `AppDispatch`, `useAppDispatch`, `useAppSelector` |
| `src/features/favorites/store/favoritesSlice.ts` | `favoritesSlice`, `toggleFavorite(id)`; state `{ ids: number[] }` |
| `src/features/watchlists/store/watchlistsSlice.ts` | `watchlistsSlice`, `createWatchlist({ id, name })`, `addMovie({ listId, movieId })`; state `{ lists: { id: string; name: string; movieIds: number[] }[] }` |
| `src/features/ui/store/uiSlice.ts` | `uiSlice`, `setTheme('light' \| 'dark')`; state `{ theme: 'light' \| 'dark' }` |
| `src/features/recentlyViewed/store/recentlyViewedSlice.ts` | `recentlyViewedSlice`, `viewMovie(id)`; state `{ ids: number[] }`, en yeni başta ve en fazla 5 |

`setupStore(preloadedState?)` her çağrıda yeni store kursun; `store` uygulamanın varsayılan store’u olsun. `RootState` ve `AppDispatch` tipleri kurulan store ile uyumlu olsun. Mevcut favori ve watchlist kullanımı yeni state ile çalışsın; Context provider zinciri kalksın. Favori değişimi ilgisiz tema tüketicisini yeniden render etmesin. Favori ekleme/çıkarma ve watchlist’in liste/film sırası korunmalı.

## Kısıtlar

- Sunucu film verisi TanStack Query’de kalır; URL araması URL’de, form taslağı RHF’de kalır.
- Dosya yolları ve export imzaları tablodaki gibi olmalıdır.
