## Neden böyle?

Erken dönüşten sonra TypeScript `path` değerini string olarak bilir. `as string` eklemek yalnızca hatayı saklardı. Görsel URL’sinin ana adresini daha sonra ayrı yardımcıda kuracağız.

## Alternatif ve dikkat

Optional chaining çökmeyi önler, ama null sonucu için kararı yine yazman gerekir. `as string` null olasılığını çalışma zamanında kaldırmaz.

## Sektörde ve devamında

Poster URL’sinin ana adresini ekleme işi ileride ayrı yardımcıya taşınacak.
