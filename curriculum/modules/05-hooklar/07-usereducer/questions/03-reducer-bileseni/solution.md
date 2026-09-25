Saf reducer ile UI event’leri birleşti. Gerçek ağ isteğinde event veya effect başlatır, sonuç `dispatch({type:'done', ...})` olur. Sonraki modülde URL state’i de devreye girecek.

## Alternatif ve tuzak

Bu küçük örnek için `useState` de yeterli olurdu; bağlantılı durum geçişlerini görünür kılmak için reducer kullandık. Ağ yan etkisi reducer’a taşınmamalı.

## Sektörde ve sonra

Pekiştirmede loading, success ve error action’ları gerçek TMDB cevabıyla birleşecek.
