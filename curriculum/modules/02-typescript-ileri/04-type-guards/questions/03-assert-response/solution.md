## Neden böyle?

- **Alternatif:** Her bileşen kendi alanlarını kontrol edebilirdi; ortak guard aynı kontrolü tekrar yazdırmaz.
- **Tuzak:** `value is MoviePage` imzası tek başına doğrulama yapmaz; gövde gerçek alanları incelemelidir.
- **Sektörde:** Küçük guard'lar, `unknown` dış veriyi kullanmadan önce sınırda kontrol eder.
- **Sonraki adım:** Bu uzun elle kontrol, Zod şemalarının neden yararlı olduğunu gösterecek.
