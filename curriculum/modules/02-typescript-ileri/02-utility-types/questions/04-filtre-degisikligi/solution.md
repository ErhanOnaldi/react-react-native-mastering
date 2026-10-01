## Neden böyle?

**Tipi içten dışa kur.** `Omit<DiscoverFilters, 'page'>` sayfayı listeden çıkarır: `{ genreId; year; sortBy }`. Dıştaki `Partial` bu üç alanın sonuna `?` ekler. Sonuç, testlerdeki açılımın aynısı: `{ genreId?: number | null; year?: number | null; sortBy?: SortBy }`.

**Neden `Partial<DiscoverFilters>` yetmez?** O tip `page`'i de isteğe bağlı olarak kabul eder. Bu durumda `applyFilterChange(filters, { page: 3 })` derlenirdi ve "filtre değişince ilk sayfa" kuralını tipin dışından delmek mümkün olurdu. Sayfa numarası filtre panelinin işi değil; tip bunu söylemeli.

**Neden `Omit`, `Pick` değil?** `Pick<DiscoverFilters, 'genreId' | 'year' | 'sortBy'>` bugün aynı sonucu verir. Ama ileride `DiscoverFilters`'a yeni bir filtre (örneğin dil) eklendiğinde panelden değiştirilebilmesini istersin. `Omit` ile yazılmış tip yeni filtreyi kendiliğinden alır, `Pick` ile yazılmış tip almaz.

**`null` ile eksik alan farklı şeyler.** `genreId: number | null` tipinde `null` "tüm türler" demek. `{ genreId: null }` spread sırasında `18`'in üstüne yazar ve filtreyi kaldırır. `{ year: 2008 }` içinde `genreId` anahtarı hiç yok, bu yüzden spread ona dokunmaz. `Partial` yalnızca `?` ekler; `null` anlamı kaynaktan gelir.

**Spread sırası.** `{ ...current, ...change, page: 1 }`: önce eski filtreler, sonra değişiklik, en son sabit sayfa. Sonra yazılan kazanır. `page: 1` başta olsaydı `...current` onu `5` ile ezerdi.

**Sektörde.** "Filtre değişince sayfalamayı sıfırla" neredeyse her liste ekranında uygulanan bir kuraldır. React Router modülünde aynı kuralı URL'deki `?page=` parametresiyle uygulayacaksın.
