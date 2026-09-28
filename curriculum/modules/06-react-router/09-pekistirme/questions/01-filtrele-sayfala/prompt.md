Statik film listesini URL'deki arama ve tür seçimlerine göre süz, ardından istenen sayfanın öğelerini döndür.

## Gereksinimler

- Başlık araması Türkçe büyük/küçük harfe duyarsız çalışsın.
- `genre` pozitif sayısal id olarak `genre_ids` içinde aranmalı; bozuk tür değeri filtre uygulanmaması gibi davransın.
- `page` eksik veya geçersizse 1 kabul edilsin.
- Önce arama ve tür filtreleri, sonra sayfalama uygulansın.

## Örnek

Üç eşleşen Aksiyon filmi, `pageSize=2&page=2` → filtrelenmiş listenin üçüncü filmi.

## Sözleşme

- `selectMovies.ts` → `selectMovies(movies, params, pageSize)`.
- Film biçimi: `{ id: number; title: string; genre_ids: number[] }`.
- `params` tipi `URLSearchParams`; dönüş, aynı film nesnelerinden oluşan dizidir.
