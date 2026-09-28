Sinema projesinin bileşen testleri için ortak ağ ve router altyapısını kur.

## Gereksinimler
- `src/test/msw/handlers.ts` içinde arama ve film detay endpoint’leri için varsayılan handler’lar bulunmalı; Authorization zorunlu olmalı, 550 için Dövüş Kulübü, bilinmeyen film için TMDB biçimli 404 dönmeli.
- `src/test/setup.ts` test başlangıcında MSW’yi başlatmalı, testten sonra DOM ve handler değişikliklerini temizlemeli, test paketi bitince server’ı kapatmalı.
- Bilinmeyen istekler testte açıkça hata vermeli; gerçek ağa çıkılmamalı.
- `src/test/render.tsx` URL başlangıç değeriyle component veya route tablosu render etmeli ve router nesnesini döndürmeli.
- Tek component için wildcard route kullan; route tablosu verildiğinde parametreli route’u olduğu gibi kullan.
- `vite.config.ts` test ayarında setup dosyasını kaydet; mevcut Router ve Vite ayarlarını koru.

## Örnek
`/movie/:id` route’u `/movie/550` başlangıç adresinde açılır → component `id=550` görür.

## Sözleşme
- `src/test/msw/handlers.ts` → `handlers` export’u.
- `src/test/setup.ts` → `server` export’u.
- `src/test/render.tsx` → `renderWithRouter(ui | routes, { route })` export’u.
- Proje: `sinema`; mevcut test bağımlılıklarının kök catalog sürümlerini kullan.

## Kısıtlar
- `src/test/setup.ts`, `src/test/msw/handlers.ts`, `src/test/render.tsx` ve `vite.config.ts` dışındaki dosyaları değiştirme.
