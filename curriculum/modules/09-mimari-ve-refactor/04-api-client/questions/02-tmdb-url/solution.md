## Neden böyle?

String birleştirmede `?`/`&` ve karakter kodlaması hataya açık. `URL.searchParams` bu işi yapar. `language` değerini ortak yerde tutmak dört sayfanın farklı dilde cevap almasını önler. Bu görev yalnız URL oluşturur; sonraki görev Bearer ve HTTP hata sınırını ekler.
