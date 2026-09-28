HTTP yanıtlarındaki önbellek talimatlarını doğru yorumlamak gereksiz ağ isteklerini önler. `Cache-Control` başlığını yapılandırılmış bir nesneye dönüştüren ve verilen yanıtın taze olup olmadığını belirleyen iki yardımcı fonksiyon yaz.

## Gereksinimler

- `parseCacheControl(header)`:
  - `header` boş (`null`, `undefined` veya yalnızca boşluk) ise boş bir nesne `{}` döndür.
  - Başlık değerlerini virgüle göre ayırıp boşluklardan arındırarak büyük/küçük harf duyarsız ayrıştır.
  - `max-age=N` ve `s-maxage=N` yönergelerindeki saniye değerlerini sayı olarak `maxAge` ve `sMaxAge` alanlarına yaz.
  - `no-cache` (`noCache`), `no-store` (`noStore`), `must-revalidate` (`mustRevalidate`), `immutable` (`immutable`), `public` (`isPublic`) ve `private` (`isPrivate`) yönergelerini boolean `true` olarak işaretle.
- `isFresh(ageSeconds, directives)`:
  - `noStore` veya `noCache` özelliklerinden biri `true` ise yanıt doğrudan bayat kabul edilir (`false`).
  - Yanıtta `maxAge` tanımlıysa ve geçen süre (`ageSeconds`) bu değerden kesinlikle küçükse tazedir (`true`); aksi halde veya eşitse bayattır (`false`).
  - `maxAge` tanımlı değilse taze kabul edilmez (`false`).

## Örnek

| Başlık | `parseCacheControl` Çıktısı |
| --- | --- |
| `"public, max-age=3600"` | `{ isPublic: true, maxAge: 3600 }` |
| `"no-cache, no-store"` | `{ noCache: true, noStore: true }` |
| `null` | `{}` |

| `ageSeconds` | Direktifler | `isFresh` Sonucu |
| --- | --- | --- |
| `30` | `{ maxAge: 60 }` | `true` |
| `60` | `{ maxAge: 60 }` | `false` |
| `10` | `{ maxAge: 60, noCache: true }` | `false` |

## Sözleşme

- `cacheControl.ts` → `CacheDirectives` arayüzü: `maxAge?: number`, `sMaxAge?: number`, `noCache?: boolean`, `noStore?: boolean`, `mustRevalidate?: boolean`, `immutable?: boolean`, `isPublic?: boolean`, `isPrivate?: boolean`.
- `cacheControl.ts` → `parseCacheControl(header: string | null | undefined): CacheDirectives`.
- `cacheControl.ts` → `isFresh(ageSeconds: number, directives: CacheDirectives): boolean`.
