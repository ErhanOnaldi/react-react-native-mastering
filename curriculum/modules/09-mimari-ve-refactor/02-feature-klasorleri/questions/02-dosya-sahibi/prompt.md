Sinema’da `posterUrl` hem arama hem favorilerde kullanılıyor; `SearchBox` yalnız aramada. Hepsini `shared/` içine atmak sahipliği gizler.

## İstenen

`chooseFolder(users)` fonksiyonunu tamamla. `users`, dosyayı kullanan feature adlarıdır.

- Tek **benzersiz** feature varsa `features/<ad>` döndür.
- İki veya daha fazla farklı feature varsa `shared` döndür.
- Hiç kullanan yoksa `unassigned` döndür; henüz ortaklaştırma yapma.

| Girdi | Çıktı |
| --- | --- |
| `['search']` | `features/search` |
| `['movies', 'movies']` | `features/movies` |
| `['movies', 'favorites']` | `shared` |
