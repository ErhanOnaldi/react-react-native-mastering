## Neden böyle?

Parametre önce `string | undefined` olarak daraltılır, sonra sayıya çevrilir. `find` sonucu da `undefined` olabilir; iki belirsizlik ayrı kontrol edilir. Bu modülde veri statik; sonraki modülde aynı id TMDB isteğinin yoluna girer ve `useEffect` bağımlılığı olur.

:::sector
Sektörde geçersiz adres ile bulunamayan kaynak için ayrı mesajlar destek sürecini kolaylaştırır.
:::
