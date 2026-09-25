## Neden böyle?

`push` ile aynı dizi referansını geri vermek ekrandaki işareti güncellemeyebilir. Spread eklerken yeni dizi üretir, `filter` çıkarırken yeni dizi döndürür. İşlemi updater içine almak hızlı ardışık tıklamalarda da güncel listeyi kullanır. Başka bir filmin id’sini korumak, bütün state’i tek boolean’a indirgemediğini doğrular.
