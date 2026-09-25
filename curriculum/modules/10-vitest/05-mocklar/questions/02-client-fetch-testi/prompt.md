`tmdbClient` Sinema’daki ortak ağ sınırı. Token veya sayfa parametresi kaybolursa bütün özellikler etkilenir. `@impl/tmdbClient` içindeki `tmdbClient.get<T>(path, params?)` fonksiyonuna test yaz.

- Her test kendi `vi.fn` fetch cevabını kursun; gerçek ağa çıkma.
- `/search/movie`, `{ query: 'Başlangıç', page: 2 }` için URL parametrelerini ve Bearer başlığını kontrol et.
- Cevaptaki film başlığının (`"Başlangıç"`) aynen döndüğünü kontrol et.
- `afterEach` içinde global fetch’i geri al.

`import.meta.env.VITE_TMDB_TOKEN` test ortamında `test-token` değerindedir. URL sırasını veya `RequestInit` nesnesinin tümünü karşılaştırman gerekmez.
