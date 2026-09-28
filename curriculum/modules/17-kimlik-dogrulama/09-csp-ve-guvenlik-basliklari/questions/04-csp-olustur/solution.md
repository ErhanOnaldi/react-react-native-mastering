# CSP Başlığı Oluşturma

Content-Security-Policy (CSP), W3C standardına göre noktalı virgülle ayrılmış yönergelerden oluşur. Her yönerge önce yönerge adını, ardından boşlukla ayrılmış izin verilen kaynakları listeler:

```text
default-src 'self'; script-src 'self' 'nonce-xyz'; img-src 'self' https://image.tmdb.org
```

## Yönerge Ayrıştırma Mantığı

1. `Object.entries(directives)` ile yönerge adı ve kaynak listesi döngüye alınır.
2. Kaynak listesi `undefined` ise veya boşsa o yönerge atlanır.
3. Kalan kaynaklar `trim()` ile temizlenip `join(' ')` ile birleştirilir.
4. Tüm kurallar `join('; ')` ile nihai başlık dizesine dönüştürülür.
