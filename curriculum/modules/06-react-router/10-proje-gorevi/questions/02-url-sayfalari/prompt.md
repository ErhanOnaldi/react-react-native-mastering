Adres artık değişiyor; ama sayfalar eski yerel state'i okursa yenileyince yine farklı içerik görürsün. Bu görevde URL ve statik veri aynı ekranı yeniden kursun.

## Dosya ve davranış sözleşmesi

- `src/pages/HomePage.tsx` → **named export** `HomePage`. `src/data/sample-movies.ts` içindeki statik filmleri göster; Dövüş Kulübü gibi kartlardan `/movie/550` detayına gerçek link ver. `src/components/MovieCard.tsx` gerekiyorsa buna göre güncelle.
- `src/pages/SearchPage.tsx` → **named export** `SearchPage`. `useSearchParams` ile `q` oku; mevcut arama input'u bu değeri göstersin. `sampleMovies` başlıklarını Türkçe büyük/küçük harfe duyarsız filtrele. Sorgu değişince `page` silinsin; varsa `genre` korunsun. Boş sonuçta anlaşılır mesaj göster. `q`, `page`, `genre` için ikinci `useState` tutma.
- `src/pages/MovieDetailsPage.tsx` → **named export** `MovieDetailsPage`. `/movie/:id` parametresini `useParams` ile al; sayısal biçimini denetle ve statik listeden filmi bul. `/movie/550` → **Dövüş Kulübü**. Geçersiz veya bulunmayan id'de kullanıcıya açık mesaj göster.
- `src/pages/FavoritesPage.tsx` → **named export** `FavoritesPage`. `useFavorites()` içindeki id'leri statik film listesiyle eşleştir; boşsa boş durum mesajı göster. Provider `main.tsx` içinde router'ın dışındadır.
- `src/pages/NotFoundPage.tsx` → **named export** `NotFoundPage`; tanımsız adres için 404 ve ana sayfa linki.

Bu modülde ağ isteği yok. Modül 7'de aynı sayfalar TMDB verisi kullanacak.
