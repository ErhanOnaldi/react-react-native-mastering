Sinema'nın ana sayfası ile arama ekranı ayrı adreslerden açılabilsin. Kullanıcı ana sayfadan aramaya geçince yeni ekranın adresi de değişmeli.

## Gereksinimler

- `/` adresinde `Sinema` başlığı görünmeli.
- Ana sayfada `Ara` adlı bağlantı bulunmalı ve hedefi `/search` olmalı.
- `/search` adresinde `Film ara` başlığı görünmeli.
- `Ara` bağlantısı seçilince adres `/search` olmalı ve arama başlığı görünmeli.

## Örnek

`/` → `Sinema`; `Ara` bağlantısını seç → `/search` ve `Film ara`.

## Sözleşme

- `routes.tsx` içinden `routes: RouteObject[]` named export edilir.
- Her iki adres de bellek tabanlı route ağacında açılabilir olmalı.
