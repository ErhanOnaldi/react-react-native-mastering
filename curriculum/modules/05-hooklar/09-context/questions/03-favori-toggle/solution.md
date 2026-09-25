Context ortak state’i tüketicilere taşır. Bu örnekte iki düğmenin birlikte değişmesi isteniyor. Çok büyük context değerleri sık değişirse tüketicilerin render maliyeti artabilir; her veriyi tek context’e doldurma.

## Alternatif ve tuzak

Diziyi yerinde değiştirmek React’in state snapshot’ını bozar. `filter` ve spread yeni dizi üretir.

## Sektörde ve sonra

Proje görevinde aynı durum localStorage üzerinden yenilemede korunacak.
