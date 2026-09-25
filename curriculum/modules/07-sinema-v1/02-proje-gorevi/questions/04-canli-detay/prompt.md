Bir karttan detaya gittin; statik dizi o filmi tanımayabilir. Film ve favori ekranlarını gerçek detay cevabıyla besle.

## Dosya ve davranış sözleşmesi

- `src/pages/MovieDetailsPage.tsx` **named export** `MovieDetailsPage` sunsun. `/movie/:id` değerini `useParams` ile al; pozitif tamsayı değilse TMDB isteği atmadan anlaşılır hata göster.
- `GET /movie/<id>?append_to_response=credits,videos&language=tr-TR` isteğiyle detay al. Film başlığını (`/movie/550` → **Dövüş Kulübü**), özetini, varsa afişini ve `credits.cast` oyuncu adlarını göster. `poster_path: null` güvenle ele alınsın.
- Loading ve 404/ağ hatası için ayrı ekran metinleri göster. Favori düğmesi mevcut Context ile çalışsın.
- `src/pages/FavoritesPage.tsx` **named export** `FavoritesPage` sunsun. Favori id'lerin detaylarını TMDB'den çekip kart olarak göster; boş favoride istek atma ve boş durum göster. Burada birden çok istek oluşması bu v1'in gözlemlenecek maliyetidir.

`routes` dizisi testte `createMemoryRouter` ile render edilir. Örnek fixture 550'nin kadrosunda Edward Norton ve Brad Pitt var.
