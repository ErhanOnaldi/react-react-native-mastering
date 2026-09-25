Reducer bir state geçiş tablosudur. Beş ayrı setter yerine tutarlı bir değişim üretir. Burada fetch yapma: daha sonraki alıştırmada effect isteği başlatır, reducer yalnızca sonucu işler.

## Alternatif ve tuzak

Beş setter aynı olaya farklı sırayla uygulanabilir; reducer tek action için tek tutarlı sonuç döner. Reducer içinde fetch veya storage yazma.

## Sektörde ve sonra

Bu action modeli birleşik `useMovieSearch` hook’unda ağ sonucunu işlemeye yarayacak.
