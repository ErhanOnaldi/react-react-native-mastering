Tarayıcı bir cevabı kullanmadan önce önbellekten alabilir mi, yoksa sunucuya doğrulatmalı mı? Verilen yönergeler ve geçen süreye göre saklanan cevabın doğrudan kullanılabileceğini belirleyen bir yardımcı yaz.

## Gereksinimler

- `canUseCachedResponse(ageSeconds, directives)` bir `boolean` döndürür.
- `directives.noCache` veya `directives.noStore` true ise sonuç false olur.
- `maxAge` yoksa sonuç false olur.
- Aksi durumda cevap yalnızca `ageSeconds`, `maxAge` değerinden küçükken doğrudan kullanılabilir.

## Örnek

| Geçen süre | Yönergeler | Sonuç |
| --- | --- | --- |
| `30` | `{ maxAge: 60 }` | `true` |
| `60` | `{ maxAge: 60 }` | `false` |
| `10` | `{ maxAge: 60, noCache: true }` | `false` |
| `1` | `{ noStore: true }` | `false` |

## Sözleşme

- `cacheControl.ts` → `CacheDirectives`: `maxAge?: number`, `noCache?: boolean`, `noStore?: boolean` alanları.
- `cacheControl.ts` → `canUseCachedResponse(ageSeconds: number, directives: CacheDirectives): boolean`.
