## Neden böyle?

Türkçe arama ve sıralama iki ayrı locale işlemi. `toLocaleLowerCase('tr-TR')` noktalı `İ` ile noktasız `I` ayrımını koruyarak eşleştirme yapar. `Intl.Collator` ise başlıkları kullanıcının beklediği alfabeye göre karşılaştırır.

`toSorted` yeni dizi verir; ekrandaki katalog verisi başka yerde paylaşılıyorsa kaynağın sırasını bozmamış olur. Türkçe aramada aksanları silmedik: `s` ile `ş` aynı karakter değildir. Arama politikası ürün gereksinimiyse, aksan duyarsız eşleşmeyi ayrıca ve bilinçli tanımlamak gerekir.
