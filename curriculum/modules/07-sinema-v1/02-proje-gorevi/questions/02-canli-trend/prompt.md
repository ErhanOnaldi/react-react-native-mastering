Statik film listesi yeni trendleri gösteremez. İlk canlı ekranı ana sayfada kur.

## Dosya ve davranış sözleşmesi

- `src/pages/HomePage.tsx` dosyası **named export** `HomePage` sunsun. `src/router.tsx` içindeki `/` index route onu render etsin; testler `routes` dizisini `createMemoryRouter` ile açar.
- TMDB `GET /trending/movie/week` isteği yap; `language=tr-TR` ve Bearer başlığı gitmeli. `MovieListResponse.results` kartları `MovieGrid` ile gösterilsin. Artık `sampleMovies` kullanılmasın.
- Yüklenirken okunur durum metni (`role="status"`), HTTP/ağ hatasında okunur hata (`role="alert"`) göster. Boş sonuç için `MovieGrid`in boş mesajı kalabilir.
- Kartlar `/movie/:id` linklerini ve mevcut favori düğmesini korusun.

Tarayıcı Network sekmesinde bir trend isteği göreceksin. Geliştirme `StrictMode`'unda effect tekrar çalışabilir; bu aşamada cache ekleme.
