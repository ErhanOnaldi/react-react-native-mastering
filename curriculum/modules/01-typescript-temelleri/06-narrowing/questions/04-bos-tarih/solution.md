## Neden böyle?

`string` tipi boş metni de içerir. Bu yüzden tip tanımı doğru olsa bile davranış için kontrol gerekir. Projede `releaseYear` boşta farklı olarak `""` dönecek; UI bunu nasıl göstereceğine karar verecek.

`any` veya tip iddiası ile hatayı saklamak yerine verinin olası durumlarını modelle.
