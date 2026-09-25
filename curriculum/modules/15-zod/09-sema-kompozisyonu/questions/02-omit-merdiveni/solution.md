## Neden böyle?

Bu, TypeScript `Omit` merdiveninin çalışma zamanı adımıdır: sadece tipi değil parse sözleşmesini de değiştirir. `.extend` yeni veri bağlamı, `.pick` küçük görünüm, `.omit` form girdisi için aynı doğrulama kaynağını korur.

## Alternatif, tuzak ve devamı

Elle üç bağımsız şema yazmak kısa vadede çalışır, fakat ad kuralı sürüklenir. TypeScript `Omit` çalışma zamanı doğrulaması yapmaz. Projede kayıt ve form şemalarını aynı merdivenden türetebilirsin.
