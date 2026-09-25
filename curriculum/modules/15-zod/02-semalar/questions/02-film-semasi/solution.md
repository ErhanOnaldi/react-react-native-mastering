## Neden böyle?

`unknown` dış veri için dürüst başlangıçtır. Type assertion burada hatayı saklardı. `nullable` gerçek TMDB davranışını temsil eder; `optional` ise eksik alanı kabul ederek farklı bir sözleşme kurar. Sonraki derste bu şemadan tip çıkaracağız.

## Alternatif, tuzak ve devamı

Alternatif olarak elle type guard yazılabilir; iç içe alanlarda tekrar artar. `optional` null yerine geçmez. Sonraki kart görevinde hatayı fırlatmak yerine `safeParse` ile kontrollü metin göstereceksin.
