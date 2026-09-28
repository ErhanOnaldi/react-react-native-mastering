Router kullanan bileşenleri başlangıç adresiyle render eden ve testte URL durumunu incelemeye izin veren bir yardımcı yaz.

## Gereksinimler
- Verilen `path` ile `route` eşleştirilerek UI router içinde açılır.
- Route parametreleri bileşene aktarılır.
- Test `render` sonucunu ve router nesnesini kullanabilir.

## Örnek
`path='/movie/:id'`, `route='/movie/550'` → ekranda `Film 550`.

## Sözleşme
- `renderWithRouter.tsx` dosyasından `renderWithRouter(ui, { path, route })` export et.
- `ui` React node; `path` ve `route` string’dir.
- Dönen değer `{ router, ...renderResult }` biçimindedir.
