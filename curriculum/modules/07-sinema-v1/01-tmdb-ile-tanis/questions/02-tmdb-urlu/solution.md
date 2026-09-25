## Neden böyle?

`URLSearchParams` boşluk, `&` ve Türkçe karakterleri query içinde güvenle taşır. Elle `?query=${query}&page=${page}` yazmak `A&B` sorgusunu iki ayrı parametre gibi gösterir. `URL` nesnesi de path ve query'yi ayrı yönetir.

Önce varsayılan `language` değerini koyup `set` kullanınca çağıran açıkça başka dil verirse tek bir `language` kalır. `append` kullansaydın aynı anahtar iki kez görünebilirdi. `undefined` değerini `String` ile dönüştürmek `page=undefined` hatasına yol açar; bu yüzden atlıyoruz.

Gerçek projedeki `src/lib/tmdb.ts`, URL kurmanın üstüne Bearer başlığı ve HTTP hata kontrolü de ekler. Bu işlev tek başına token saklamaz. Sonraki modüllerde API istemcisini tipli ve merkezi hale getireceksin.
