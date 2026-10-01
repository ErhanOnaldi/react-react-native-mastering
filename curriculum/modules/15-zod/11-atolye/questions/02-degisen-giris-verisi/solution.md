## Neden böyle?

Form alanı boşken ham değer `''` olur; callback'in sözleşmesinde ise tarih girilmemişse `undefined` isteniyor. `.transform` boşu `undefined`'a çevirir, ardından `.refine` yalnızca dolu ama biçimsiz girdiyi reddeder.

Alternatif olarak boş string'i submit callback'inde elle `values.dueDate || undefined` ile dönüştürebilirsin; ama o zaman format kontrolü ile dönüşüm iki farklı yerde yaşar. Sık tuzak: `.optional()` eklemek — bu yalnızca `undefined` değerini kabul eder, RHF'nin verdiği `''` değerini dönüştürmez.
