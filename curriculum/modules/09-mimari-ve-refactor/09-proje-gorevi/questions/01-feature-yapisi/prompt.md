Sinema v1’de MovieCard, sayfalar ve yardımcılar farklı kök dizinlerde. Bir filmi ararken dört klasör geziyorsun; göreli importlar taşımada kırılıyor.

## İstenen

- `src/features/movies/{api,components,hooks}`, `src/features/search/`, `src/features/favorites/` ve `src/shared/{ui,lib,api,config}` sınırlarını kur. Önceki dosyaları uygun yerlere taşı; boş dizinler Git’te tutulmadığı için ihtiyaç duydukça dosya ekle.
- `src/shared/lib/format.ts` içinden `formatVote`, `releaseYear`, `formatDate`; `src/shared/lib/tmdb-image.ts` içinden `posterUrl` exportları eski davranışlarıyla çalışsın. Ortak UI kitini `src/shared/ui/` altına taşı.
- `tsconfig.app.json` içindeki `compilerOptions.paths` değerine `"@/*": ["./src/*"]` ekle. TypeScript 6 için `baseUrl` ekleme. `vite.config.ts` içinde `resolve.alias` ile `@` işaretini `src/` mutlak yoluna bağla.
- Taşınan dosyaların importlarını `@/` ile güncelle. Ana sayfa, arama, detay ve favoriler ile `?q=`, `?page=`, `?genre=` davranışlarını koru.

Her küçük taşımadan sonra Sinema içinde `pnpm typecheck` ve `pnpm lint` çalıştır. Bu görev testleri yeni ortak yolların **davranışını** denetler; klasör sahipliği ve alias kullanımı rubric ile incelenir.
