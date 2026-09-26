# Sinema’nın client state haritası

Favori yıldızı beş Context provider’ından geçiyor; tema bileşeni de gereksiz render oluyor. Önce sahipliği düzelt: TMDB film detayları `movieQueries` ve TanStack Query’de, `?q=` URL’de, form taslağı RHF’de kalsın.

## Dosyalar ve export sözleşmesi

| Dosya | Zorunlu export ve davranış |
| --- | --- |
| `src/app/store.ts` | `store`, `setupStore(preloadedState?)`, `RootState`, `AppDispatch`, `useAppDispatch`, `useAppSelector` |
| `src/features/favorites/store/favoritesSlice.ts` | `favoritesSlice`, `toggleFavorite(id)`; state `{ ids: number[] }` |
| `src/features/watchlists/store/watchlistsSlice.ts` | `watchlistsSlice`, `createWatchlist({ id, name })`, `addMovie({ listId, movieId })`; state `{ lists: { id: string; name: string; movieIds: number[] }[] }` |
| `src/features/ui/store/uiSlice.ts` | `uiSlice`, `setTheme('light' | 'dark')`; state `{ theme: 'light' | 'dark' }` |
| `src/features/recentlyViewed/store/recentlyViewedSlice.ts` | `recentlyViewedSlice`, `viewMovie(id)`; state `{ ids: number[] }`, en yeni başta ve en fazla 5 |

`setupStore(preloadedState?)` her çağrıda yeni store kursun; `store` uygulamanın varsayılan store’u olsun. `RootState` ve `AppDispatch` tipleri kurulan store ile uyumlu olsun. Mevcut favori ve watchlist kullanımı yeni state ile çalışsın; Context provider zinciri kalksın. Favori değişimi ilgisiz tema tüketicisini yeniden render etmesin. Favori ekleme/çıkarma ve watchlist’in liste/film sırası korunmalı.

## Elle dene

Dövüş Kulübü (550) ve Matrix (603) favorilerini sırayla işaretle, 550’yi çıkar. İzleme listesi oluşturup 603’ü ekle. Tema değişirken favori sayısı sabit kalmalı.
