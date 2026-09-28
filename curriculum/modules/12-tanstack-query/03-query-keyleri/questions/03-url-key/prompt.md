URL arama parametrelerini cache kimliğinde kullanılan temiz metin ve güvenli sayıya dönüştür.

## Gereksinimler

- `q` yoksa boş string kullan; varsa baş ve sondaki boşlukları temizle.
- `page` pozitif tam sayı değilse 1 kullan.
- Dönüş değeri sırasıyla `movies`, `search`, query ve page öğelerini içersin.

## Örnek

- `q=D%C3%B6v%C3%BC%C5%9F&page=2` → `['movies', 'search', 'Dövüş', 2]`
- `q=Matrix&page=abc` → `['movies', 'search', 'Matrix', 1]`

## Sözleşme

- `searchKey.ts` dosyasından `searchKey(params: URLSearchParams)` named export edilir.
- Dönüş tipi literal tuple’dır: `readonly ['movies', 'search', string, number]`.
