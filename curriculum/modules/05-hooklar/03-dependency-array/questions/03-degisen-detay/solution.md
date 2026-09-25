Boş dependency array yalnızca ilk mount için uygundur. Detay sayfasındaki `id` değişebilir; effect bu değere bağlı olmalı. Sonraki soruda nesne dependency’sinin neden tekrar isteğe yol açtığını göreceksin.

## Alternatif ve tuzak

`[]` yazmak yalnızca ilk `id` ile eşleşir. Bileşeni `key` ile zorla yeniden kurmak burada çalışabilir ama gerçek senkronizasyon bağımlılığını gizler.

## Sektörde ve sonra

Yeni isteği başlatmak yeterli değil; sonraki derste önceki cevabı da durduracaksın.
