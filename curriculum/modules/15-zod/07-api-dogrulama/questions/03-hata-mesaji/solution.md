## Neden böyle?

`z.prettifyError` log ve geliştirici tanısı için kullanışlıdır. Alan bazlı form gösteriminde `z.treeifyError` daha uygundur. Kullanıcı ekranında ham API yapısı yerine kısa bir hata cümlesi göstermek daha doğrudur.

## Alternatif, tuzak ve devamı

`error.message` ham ve sürüme göre farklı görünebilir; `z.prettifyError` okunur tanı üretir. Form alanlarına ayrı mesaj yerleştirirken `z.treeifyError` daha uygun olabilir. Sonraki aşamada kullanıcıya teknik alan yolunu bire bir göstermeyi seçme.
