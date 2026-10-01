## Neden böyle?

URL tüm değerleri string taşır. `z.coerce.number()` sayıya dönüştürür ama `min(1)` olmadan `0` geçer. `z.coerce.boolean()` `"false"` değerini true yapar; bunun yerine `z.stringbool()` metni anlamsal olarak okur.

## Alternatif, tuzak ve devamı

`Number("abc")` NaN üretir; yalnızca dönüşüm yeterli değildir. `z.coerce.boolean()` dolu `"false"` metnini true yapar. Aynı sınır fikri env stringlerinde de kullanılacak.
