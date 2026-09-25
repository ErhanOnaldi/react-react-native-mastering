Sinema’da favori prop’larını her aracı bileşenden geçirmeye gerek kalmasın.

- `src/context/FavoritesContext.tsx` → **named** `FavoritesProvider` ve `useFavorites()` export et.
- `useFavorites()` `{ favoriteIds, isFavorite(id), toggleFavorite(id) }` döndürsün. `favoriteIds` sayı dizisi olsun; toggle aynı id’yi ekler/çıkarır ve localStorage’da kalıcı tutar.
- Provider dışı kullanımda açıklayıcı hata fırlat.
- `src/main.tsx` içinde `App`’i `FavoritesProvider` ile sar.
- `src/App.tsx` ve kartlar artık bu ortak favori durumunu kullansın; favori düğmesi yenileme sonrası da doğru işaretli olsun.

Mevcut statik örnek filmleri kullanmaya devam et. Hook dosya yolu ve export adlarını koru.