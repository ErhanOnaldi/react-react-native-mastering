Arama URL'sinden `page` ve `archived` oku. `readFilters(search: string)` export et.

- `?page=2&archived=false` → `{ page: 2, archived: false }`.
- Sayfa yoksa `1`; geçersiz, kesirli veya sıfırsa güvenli varsayılan `1`.
- `archived` yoksa false; `true`, `false`, `1`, `0` gibi metinleri Zod 4 `z.stringbool()` ile oku. Geçersiz metinde false kullan.
- `page` için `z.coerce.number().int().min(1)` kullan.
