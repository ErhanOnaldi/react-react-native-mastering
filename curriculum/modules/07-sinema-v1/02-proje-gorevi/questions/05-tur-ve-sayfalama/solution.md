## Neden böyle?

URL state'i `genre` ve `page` değerlerini paylaşılabilir kılar. Filtre değiştiğinde sayfa 2'yi korumak boş veya şaşırtıcı bir sonuç verebilir. `total_pages` sunucunun verdiği sınırdır; sabit 500 yazma.

Tür listesi ve film listesi ayrı GET'lerdir. HomePage yeniden mount olunca ikisi de yeniden gider. Bu sürümde gözlem için açık bırakıyoruz; ileride cache aynı cevabı tekrar kullanabilir.
