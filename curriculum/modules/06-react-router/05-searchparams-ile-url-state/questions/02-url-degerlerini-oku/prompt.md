Arama URL'sindeki metin değerlerini güvenli ve tutarlı bir görünüm seçimine dönüştür.

## Gereksinimler

- `q` değerinin başındaki ve sonundaki boşlukları kaldır; yoksa `''` döndür.
- `page` pozitif güvenli tam sayı değilse `1` döndür.
- `genre` pozitif güvenli tam sayı değilse `null` döndür.
- Ondalık değerleri ve sayısal olmayan metinleri geçersiz say.

## Örnek

`?q=Matrix&page=3&genre=28` → `{ q: 'Matrix', page: 3, genre: 28 }`.

## Sözleşme

- `readSearch.ts` → `readSearch(params: URLSearchParams): { q: string; page: number; genre: number | null }`.
