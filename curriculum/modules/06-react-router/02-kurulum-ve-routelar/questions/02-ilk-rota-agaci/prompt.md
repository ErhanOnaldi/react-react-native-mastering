Sinema'nın `setPage('search')` geçişinde adres `/` kalıyor. İlk paylaşılabilir sayfaları kur.

## Görev

`routes.tsx` içindeki `routes: RouteObject[]` dizisini doldur:

- `/` → `Sinema` başlıklı bir sayfa ve `/search` adresine giden **Ara** linki.
- `/search` → `Film ara` başlıklı sayfa.
- Bağlantı için `react-router` içinden `Link` kullan. Testler diziyi `createMemoryRouter` ile açar.

Örnek: kök sayfada Ara'ya basınca adres `/search` ve başlık `Film ara` olur.
