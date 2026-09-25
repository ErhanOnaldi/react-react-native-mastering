## Neden böyle?

Callback parametresinin tipi `MovieLabelInput[]` üzerinden çıkarılır. Böylece yanlış alan adı burada da yakalanır. Fallback UI kararıdır; API modeline yazılmaz.

## Alternatif ve dikkat

For döngüsü de çalışır; `map` her filmden tam bir etiket üretildiğini açık gösterir. Callback’e `any` ekleme; yanlış `release_date` yazımını yeniden görünmez yapar.

## Sektörde ve devamında

Kart bileşenleri bu etiketleri props üzerinden gösterecek.
