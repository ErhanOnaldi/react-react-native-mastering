## Neden böyle?

`string | null` veri şeklidir; `PosterState` ise uygulamanın UI kararıdır. İkisini ayırmak farklı ekranların aynı veriyi farklı göstermesine izin verir.

## Alternatif ve dikkat

Boş posteri ayrı üçüncü duruma da ayırabilirsin; bu UI’da ikisi aynı gösterildiği için tek `missing` seçtik. Null kontrolü tek başına boş string’i hazır sayar.

## Sektörde ve devamında

Veri tipi ile ekranda gösterilecek durum tipini ayrı tut.
