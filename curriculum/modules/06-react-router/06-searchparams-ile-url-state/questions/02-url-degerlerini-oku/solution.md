## Neden böyle?

URL metni tip dönüşümü ve varsayılan gerektirir. `Number(null)` sıfır döndürdüğü için özellikle `genre` yokluğunu önce ayırmalısın. Bu değerler ayrı `useState` içinde tutulmaz; her render'da URL'den türetilir. Sonraki görev kontrol değişimlerini adrese yazacak.

:::sector
Sektörde paylaşılan bağlantının aynı ekranı üretmesi, hatayı yeniden açabilmek için değerlidir.
:::
