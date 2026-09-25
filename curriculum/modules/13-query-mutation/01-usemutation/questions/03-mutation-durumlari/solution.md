## Neden böyle?

Mutation yazma işleminin pending/success/error durumunu bir yerde tutar. `mutate` event handler’da kullanılır; render içinde çağırmak tekrar tekrar POST üretir. Bir sonraki derste başarılı POST’un liste cache’ini neden yenilemediğini göreceksin.
