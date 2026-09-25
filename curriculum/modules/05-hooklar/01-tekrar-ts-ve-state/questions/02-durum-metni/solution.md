`status` daraltması sayesinde `data` yalnızca success dalında vardır. Boş listeyi loading ile karıştırırsan kullanıcı isteğin sürüp sürmediğini anlayamaz. Aynı biçim `useFetch` dönüşünde yeniden karşına çıkacak.

## Alternatif ve tuzak

Tek bir `data?: T` nesnesi bütün durumlara izin verir ve `undefined` kontrollerini her yerde çoğaltır.

## Sektörde ve sonra

Bu union, daha sonra `useFetch` ve arama reducer’ında aynı dört durumu taşıyacak.
