## Neden böyle?

`filter` kaynak diziyi değiştirmez; `map` her elemandan yeni değer üretir. Poster null olasılığı bu listede görünür. Daha sonra poster olmayan kart için farklı bir UI fallback seçebilirsin.

## Alternatif ve dikkat

Tek döngü de yazılabilir; `filter` ve `map` iki ayrı niyeti okunur kılar. Kaynak diziye `splice` uygulama; sonraki React state kullanımında mutasyon sorun çıkarır.

## Sektörde ve devamında

Kartların postersizleri nasıl göstereceğine ileride UI karar verecek.
