Trend listesi çalışıyor; şimdi "Aksiyon" seçip ikinci sayfaya geçmek istiyorsun. URL bu görünümü yeniden kurabilmeli.

## Dosya ve davranış sözleşmesi

- `src/pages/HomePage.tsx` **named export** `HomePage` sunsun. `/genre/movie/list` ile tür adlarını al ve erişilebilir bir tür seçici göster.
- `?genre=28` seçilince `/discover/movie?with_genres=28&page=1&language=tr-TR` isteği yap; genre yoksa `/trending/movie/week` kullan. Tür değişince eski `page` değerini sil; diğer URL anahtarlarını koru.
- `?page=2` ikinci sayfa verisini getirsin. `MovieListResponse.page` ve `total_pages` değerlerini göster; Önceki/Sonraki düğmeleri geçerli sınırlar içinde URL'yi güncellesin.
- `src/pages/SearchPage.tsx` içindeki `?q=...&page=...` araması da aynı sayfalama kuralını izlesin. Sorgu değişince sayfa 1'e dönsün.
- Her yeni istek için loading/hata durumunu göster. Tekrar eden kodu henüz gizleme; acı günlüğünde say.

Örnek: `/?genre=28&page=2` adresi Aksiyon filmlerinin ikinci sayfasını açar. İlk sayfadaki film kartları kaybolur ve yeni sonuç görünür.
