Film detay ve arama okumaları için çağıranların paylaşabileceği tipli sorgu tarifleri üret.

## Gereksinimler

- `all` değeri `['movies']` olsun.
- Detay tarifi id’yi cache kimliğine ve `/3/movie/:id` isteğine taşısın.
- Arama tarifi temizlenmiş query ve page değerlerini hem kimlikte hem istekte kullansın.
- İki tarif de 60 saniyelik tazelik politikasına sahip olsun.
- Dönüş veri tipi fetch işlevinden çıkarılsın; çağıran ek generic belirtmek zorunda kalmasın.
- HTTP hata yanıtları reject olsun.

## Örnek

`detail(550)` başlık olarak `Dövüş Kulübü` döndürür. `search(' Dövüş ', 1)` isteği `query=Dövüş` ve `page=1` değerleriyle gönderir.

## Sözleşme

- `movieQueries.ts` dosyasından `movieQueries` named export edilir.
- `all`, `detail(id: number)` ve `search(query: string, page: number)` public üyeleri bulunur.
- `detail` verisinin tipi `{ id: number; title: string }` olur.
- `search` verisinin `results` alanı `{ id: number; title: string }[]` içerir.

## Kısıtlar

- TMDB istekleri `Authorization: Bearer test-token` ve `language=tr-TR` kullanır.
