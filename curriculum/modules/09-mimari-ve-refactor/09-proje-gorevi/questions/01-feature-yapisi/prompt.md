Sinema v1 dosyalarını özelliğine göre düzenle; ortak yardımcılar tek yerden kullanılsın ve mevcut ekran davranışları sürsün.

## Gereksinimler

- Film, arama ve favori kodları özelliklerine göre gruplanmış olsun; gerçekten ortak kullanılan kod ortak alanda dursun.
- Ana sayfa, arama, detay, favori, tür filtresi ve sayfalama akışları aynı sonucu versin.
- Paylaşılabilir `q`, `page` ve `genre` seçimleri adresle ve ekrandaki içerikle eşleşsin.
- TypeScript ve Vite aynı kaynak kökü için `@/` importlarını çözsün.
- Ortak puan, yıl, tarih ve afiş yardımcıları aşağıdaki sözleşmedeki yollarla kullanılsın.

## Örnek

Favorilerde ve aramada aynı afiş adresi üreticisi kullanılır. Arama sonucu `?q=Matrix&page=2` bağlantısı açıldığında sorgu ve sayfa ekranda aynı kalır.

## Sözleşme

- `src/shared/lib/format.ts` → `formatVote`, `releaseYear`, `formatDate` named exportları.
- `src/shared/lib/tmdb-image.ts` → `posterUrl` named export'u.
- `tsconfig.app.json` paths: `"@/*": ["./src/*"]`; `vite.config.ts` içindeki `@` eşlemesi `src/` mutlak yoluna karşılık gelir.
- Ortak helper davranışı mevcut giriş/çıktı sözleşmesiyle aynı kalır.

Örnekler: `formatVote(0)` → `Henüz oy yok`; `releaseYear('')` → boş string; `formatDate('')` → `Tarih yok`; `posterUrl(null)` → `undefined`; `posterUrl('/afis.jpg', 'w185')` → `https://image.tmdb.org/t/p/w185/afis.jpg`.

## Kısıtlar

- `@/` kullanımı feature sahipliğini değiştirmez; feature'lar ortak katmana, ortak katman feature'lardan bağımsız kalır.
