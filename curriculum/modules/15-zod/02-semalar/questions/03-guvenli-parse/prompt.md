TMDB'den gelen film kaydı hatalıysa kart çökmek yerine uyarı göstersin. `movieLabel(raw: unknown)` export et.

- `{ title: "Matrix" }` → `"Matrix"`.
- `title` eksik, null veya boşsa → `"Film verisi geçersiz"`.
- Doğrulama için `safeParse` kullan; `as` ile atlama.
