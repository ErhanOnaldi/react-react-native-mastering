Bir dosyayı kullanan feature'lara göre uygun klasör yolunu üret. Böylece tek tüketicili kodun sahibi, gerçek ortaklıktan ayrılır.

## Gereksinimler

- Kullanıcı adlarını tekrarsız değerlendir.
- Hiç kullanıcı yoksa `unassigned` döndür.
- Tek farklı kullanıcı varsa `features/<ad>` döndür.
- Birden fazla farklı kullanıcı varsa `shared` döndür.

## Örnek

| Girdi | Çıktı |
| --- | --- |
| `['search']` | `features/search` |
| `['movies', 'movies']` | `features/movies` |
| `['movies', 'favorites']` | `shared` |
| `[]` | `unassigned` |

## Sözleşme

- Dosya ve export: `chooseFolder.ts` → `chooseFolder(users: string[]): string`
- `users`, dosyayı kullanan feature adlarını içerir.
