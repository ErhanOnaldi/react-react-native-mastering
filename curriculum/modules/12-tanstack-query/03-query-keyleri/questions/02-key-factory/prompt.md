`q` değiştiğinde aynı liste kalıyordu: key eksik. Ortak bir key factory yaz.

## İstenen

- `movieKeys.all` → `['movies']`.
- `search(query, page)` → `['movies', 'search', query.trim(), page]`.
- `detail(id)` → `['movies', 'detail', id]`.
- Tuple türlerini `as const` ile koru. Örnek: `search(' Matrix ', 2)` ile `search('Matrix', 2)` aynı olmalı.
