## Neden böyle?

`useEffect` her render’da aynı yerde çağrılır; yalnızca içindeki başlık güncellemesi `id` varsa yapılır. Böylece Hook sırası sabit kalırken boş ve dolu film durumları ekranda ayrı kalır.
