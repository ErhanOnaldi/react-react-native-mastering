## Neden böyle?

`ensureQueryData` cache’de veri varsa onu döndürür, yoksa getirir. Bileşende aynı key ile `useSuspenseQuery` kullanmak canlı cache aboneliğini korur. Loader sonucunu state’e kopyalamak invalidation’dan sonra eski detay bırakabilir.
