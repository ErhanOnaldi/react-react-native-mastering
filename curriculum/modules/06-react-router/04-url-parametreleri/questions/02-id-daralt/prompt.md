`useParams<'id'>()` sana `string | undefined` verir. `Number('abc')` ise `NaN` üretir; TMDB'ye anlamsız adres gönderme.

## Görev

`parseMovieId(id)` geçerli pozitif tam sayı id'yi `number` olarak, diğer değerleri `null` olarak döndürsün.

| Girdi | Çıktı |
| --- | --- |
| `'550'` | `550` |
| `undefined`, `''`, `'5x'`, `'0'` | `null` |
| güvenli tam sayı sınırını aşan metin | `null` |
