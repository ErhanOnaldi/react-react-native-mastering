İlk örnekte tek nesne vardı; burada liste cevabının `results` katmanı var. Effect yine senkronizasyon yeri. Hata ve boş listeyi henüz tam ele almıyoruz; `RemoteData` ve `useFetch` bunun için gelecek.

## Alternatif ve tuzak

Liste cevabını doğrudan `string[]` sanmak `results` katmanını atlar. Boş liste için ayrıca bir başarı ekranı tasarlamak gerekir.

## Sektörde ve sonra

Bu listeyi ileride `useFetch<MovieListResponse>` ile ortaklaştıracaksın.
