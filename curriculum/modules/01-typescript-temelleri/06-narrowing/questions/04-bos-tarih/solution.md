## Neden böyle?

`string` tipi boş metni de içerir. Bu yüzden tip tanımı doğru olsa bile davranış için kontrol gerekir. Projede `releaseYear` boşta farklı olarak `""` dönecek; UI bunu nasıl göstereceğine karar verecek.

## Alternatif ve dikkat

`date.slice(0, 4) || "Tarih yok"` kısa alternatiftir; erken dönüş iki durumu açık anlatır. Boş string bir tip hatası değildir.

## Sektörde ve devamında

Projede `releaseYear` boşta boş döner; gösterim fallback’ini kart seçer.
