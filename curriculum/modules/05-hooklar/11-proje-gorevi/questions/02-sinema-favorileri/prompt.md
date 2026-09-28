Sinema'da favori durumu ara bileşenlerden prop olarak taşınmadan kartlara ulaşmalı. Favoriler kalıcı olmalı ve provider sınırı açık hata vermeli.

## Gereksinimler

- Favori id listesi ortak provider altında paylaşılır.
- `toggleFavorite(id)` aynı id'yi ekler veya çıkarır.
- `isFavorite(id)` güncel favori durumunu döndürür.
- Favoriler localStorage üzerinden yeni mount sonrası korunur.
- Provider dışında kullanım açıklayıcı hata fırlatır.
- `App` ve kartlar ortak favori durumunu kullanır; prop zinciri gereksiz yere devam etmez.
- `main.tsx` uygulamayı provider ile sarar.

## Örnek

550 id'li film için düğme önce `Favoriye ekle` durumundadır. Tıklanınca 550 favorilere eklenir; sayfa yeniden mount edilse bile aynı film favori görünür. Tekrar tıklanınca listeden çıkar.

## Sözleşme

- `src/context/FavoritesContext.tsx` → named export `FavoritesProvider`, `useFavorites`
- `useFavorites()` dönüşü: `{ favoriteIds, isFavorite(id), toggleFavorite(id) }`
- `favoriteIds`: `number[]`
- `src/main.tsx` → `App` bileşeni `FavoritesProvider` altında render edilir.
- `src/App.tsx` ve kartlar bu ortak durumu kullanır.

## Kısıtlar

- Mevcut statik örnek filmlerle devam et.
- Hook dosya yollarını ve export adlarını koru.
