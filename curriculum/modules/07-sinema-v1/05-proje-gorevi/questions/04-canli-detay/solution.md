## Neden böyle?

Liste öğesi `Movie`, detay cevabı `MovieDetails` tipindedir; oyuncular yalnızca detay çağrısında gelir. `append_to_response` ayrı credits isteğini azaltır. `useParams` string veya undefined döner; sayıya dönüştürmeden önce doğrulama gereklidir.

Favorileri id olarak saklamak küçük client state tutar; fakat sayfa açılınca her id için API isteği gerekir. Bu tekrar isteği gözlemleyip acı günlüğüne yaz. Detay effect'inin `id` bağımlılığını da incele: eksik dependency sonraki lint modülünün gerçek bir vakasıdır.
