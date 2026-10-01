Sinema uygulaman `http://localhost:5173` adresinde çalışıyor. Bir origin; protokol, host ve port alanlarından oluşur. Bu üç alanı taşıyan iki nesnenin aynı origin olup olmadığını belirleyen yardımcı fonksiyon yaz.

## Gereksinimler

- `isSameOrigin(app, api)` iki `{ protocol, host, port }` nesnesi alıp `boolean` döndürür.
- Üç alan da aynıysa `true`; bu alanlardan biri farklıysa `false` döndürülür.

## Örnek

| Uygulama origin'i | API origin'i | Sonuç |
| --- | --- | --- |
| `{ protocol: 'http:', host: 'localhost', port: '5173' }` | `{ protocol: 'http:', host: 'localhost', port: '5173' }` | `true` |
| `{ protocol: 'http:', host: 'localhost', port: '5173' }` | `{ protocol: 'http:', host: 'localhost', port: '5000' }` | `false` |
| `{ protocol: 'http:', host: 'localhost', port: '5173' }` | `{ protocol: 'https:', host: 'localhost', port: '5173' }` | `false` |

## Sözleşme

- `sameOrigin.ts` → `Origin` arayüzü (`protocol`, `host`, `port`: `string`).
- `sameOrigin.ts` → `isSameOrigin(app: Origin, api: Origin): boolean`.
