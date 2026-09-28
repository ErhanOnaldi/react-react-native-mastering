Adres artık değişiyor; sayfalar da yenileme ve doğrudan açılışta aynı statik içeriği kurmalı. URL seçimi ile mevcut favori state'ini doğru sahiplerinde tut.

## Gereksinimler

- Ana sayfada statik filmler listelensin; Dövüş Kulübü kartı `/movie/550` adresine gitsin.
- Arama sayfası URL'deki `q` değerini input'ta göstersin ve statik başlıkları Türkçe büyük/küçük harfe duyarsız filtrelesin.
- Arama değişince `page` kaldırılsın, `genre` korunsun; boş eşleşmede anlaşılır mesaj görünsün.
- `/movie/550` Dövüş Kulübü'nü açsın; geçersiz ve bulunmayan id'ler için ayrı açıklama gösterilsin.
- Favoriler sayfası mevcut favori id'lerini filmlerle eşleştirsin; liste boşsa boş durum mesajı gösterilsin.
- Tanınmayan adres için 404 başlığı ve ana sayfa bağlantısı bulunsun.
- Bu modülde sayfa içeriği statik veriden gelir; ağ isteği gerekmiyor.

## Örnek

`/search?q=Matrix` → input'ta Matrix ve eşleşen film; `/movie/550` → Dövüş Kulübü.

## Sözleşme

- `src/pages/HomePage.tsx` → named export `HomePage`; `src/data/sample-movies.ts` içindeki listeyi kullan.
- `src/pages/SearchPage.tsx` → named export `SearchPage`.
- `src/pages/MovieDetailsPage.tsx` → named export `MovieDetailsPage`.
- `src/pages/FavoritesPage.tsx` → named export `FavoritesPage`; `src/context/FavoritesContext.tsx` içindeki `useFavorites()` değerini kullan.
- `src/pages/NotFoundPage.tsx` → named export `NotFoundPage`.
- `src/components/MovieCard.tsx` gerekirse güncellenebilir. Film biçimi `id`, `title`, `genre_ids` alanlarını içerir.
