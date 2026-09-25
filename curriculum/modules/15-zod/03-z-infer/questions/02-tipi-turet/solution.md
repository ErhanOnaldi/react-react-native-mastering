## Neden böyle?

Şema değişirse çıkarılan tip de değişir. Ayrı interface form doğrulamasından kopabilir. Trim bir dönüşümdür ama burada giriş ve çıkış ikisi de string; ileride sayı dönüşümünde `z.input` ve `z.output` ayrılacak.

## Alternatif, tuzak ve devamı

Elle interface yazmak ilk gün kolay görünür, fakat şema değişince eski kalır. `z.infer` boş stringi tipte yasaklayamaz; çalışma zamanında `.min(1)` çalışır. Dönüşen sayı alanında `z.input` ve `z.output` ayrımını tekrar göreceksin.
