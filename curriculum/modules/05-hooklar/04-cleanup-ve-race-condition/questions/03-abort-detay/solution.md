`ignore` yalnızca eski cevabın state’e yazılmasını durdurur; abort ayrıca gereksiz işi keser. Abort edilen fetch Promise’i reddeder, bu yüzden `AbortError` normal bir cleanup sonucu olarak ele alınır. Yeni `id` için yeni controller şarttır.

## Alternatif ve tuzak

Abort edilen isteğin reddedilmesi normaldir; onu “Hata” diye gösterme. Tek controller’ı bütün id’ler için kullanırsan yeni isteği de iptal edebilirsin.

## Sektörde ve sonra

Aynı cleanup deseni custom `useFetch` hook’una taşınacak.
