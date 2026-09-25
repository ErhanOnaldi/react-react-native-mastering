Yeni URL her effect çalışmasında kurulabilir; dependency olarak primitive query yeterlidir. Nesneyi render sırasında kurup dependency’ye koymak her render’da gereksiz effect çalıştırabilir. Boş sorguda ağ isteği yapmamak da dış sistemle eşleşmenin bir parçasıdır.

## Alternatif ve tuzak

URL’yi elle `?query=${query}` olarak birleştirmek boşluk ve Türkçe karakterlerde hata doğurabilir. `searchParams` bunu kodlar.

## Sektörde ve sonra

Hızlı yazmada birden çok istek yarışacak; cleanup sonraki adım.
