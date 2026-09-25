## Sorun
Perde arkasındaki ilk TMDB handler’ı Bearer başlığını denetliyor. Teste özel handler yazınca bu kontrolü yanlışlıkla atlayabilirsin.

## Görev
`filmHandler` adında MSW `http.get` handler’ı export et. URL `${TMDB_BASE}/movie/:id` olsun. `Authorization` başlığı `Bearer ` ile başlayıp boş olmayan bir token içermiyorsa 401 ve `{ status_code: 7 }` döndür. İd `550` ise `{ id: 550, title: "Dövüş Kulübü" }` döndür; diğer id’lerde 404 ve `{ status_code: 34 }` döndür.

## Örnek
`GET /movie/550` + `Bearer demo` → 200; başlık yok → 401.
