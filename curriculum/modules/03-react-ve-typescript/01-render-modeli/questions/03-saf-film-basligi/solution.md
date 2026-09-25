## Neden böyle?

Aynı props ile aynı çıktı üreten bileşen, tekrar render edildiğinde sürpriz yaratmaz. Yılı başlık metnine yapıştırmak yerine ayrı öğe yapmak, boş değeri saklamayı kolaylaştırır. `year` boş string iken koşul hiçbir metin bırakmaz. Daha sonra bu kart API verisinden beslense de render saf kalmalıdır.
