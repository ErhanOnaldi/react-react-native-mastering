TMDB detay yanıtı 200 olsa bile yanlış biçimli olabilir. `getMovie(path: string)` export et.

- `GET ${TMDB_BASE}${path}` at; `Authorization: Bearer test-token` başlığı gönder.
- `!response.ok` için HTTP durumunu içeren hata fırlat.
- JSON'u `unknown` olarak al; `z.object({ id: z.number().int(), title: z.string().min(1) })` ile parse et.
- Başarılı sonuç `{ id, title }` olsun. `title: null` için promise reddedilmeli.
