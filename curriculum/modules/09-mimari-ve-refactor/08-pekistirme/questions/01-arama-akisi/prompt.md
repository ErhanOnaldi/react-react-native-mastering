Arama API çağrısını sadeleştirirken mevcut sonuçları, sayfalamayı ve kimlik bilgisini koru.

## Gereksinimler

- Arama `Dövüş` ile `Dövüş Kulübü` sonucunu bulsun.
- İstenen sayfa TMDB isteğine gönderilsin ve yanıtta korunmalı.
- Türkçe karakter içeren arama parametresi doğru iletilsin.
- Sayfa 1 ve diğer sayfalar aynı HTTP çağrı yolunu kullansın.
- URL kurucu ayrı dışarı aktarılıp arama akışında kullanılsın.

## Örnek

`searchMovies('Dövüş', 2, 'test-token')` çağrısı `/search/movie` isteğinde `query=Dövüş`, `page=2`, `language=tr-TR` iletilmiş bir sonuç döndürür.

## Sözleşme

- `searchMovies.ts` → named export `searchMovies(query: string, page: number, token: string)`.
- `buildSearchUrl.ts` → named export `buildSearchUrl(query: string, page: number): string`.
- Sonuç en az `page: number` ve `results: { id: number; title: string }[]` alanlarını taşır.

## Kısıtlar

- Herhangi bir arama için en fazla bir `fetch` çağrı yeri bulunsun.
- Yetkilendirme Bearer başlığıyla gönderilsin.
