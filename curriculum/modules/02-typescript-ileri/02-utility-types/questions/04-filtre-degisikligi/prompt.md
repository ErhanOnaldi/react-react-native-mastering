Sinema'nın keşfet sayfasında tür, yıl ve sıralama filtreleri var. Kullanıcı filtre panelinde her seferinde tek bir filtreyi değiştiriyor. Şu an değişiklik fonksiyonu bütün filtreleri istiyor ve hiçbir şeyi güncellemiyor. Değişikliğin tipini ve uygulanmasını düzelt.

Kullanıcı 5. sayfadayken türü değiştirirse yeni sonuçların 5. sayfasında kalmamalı. Yeni sonuçlar ilk sayfadan başlamalı.

## Gereksinimler

- Değişiklik nesnesinde `genreId`, `year` ve `sortBy` alanlarının her biri isteğe bağlı olmalı. Alan tipleri `DiscoverFilters`'tan gelmeli.
- Değişiklik nesnesi `page` alanını kabul etmemeli; `{ page: 3 }` göndermek tip hatası vermeli.
- Değişiklikte bulunan alanlar güncellenmeli, bulunmayanlar olduğu gibi kalmalı.
- Bir alan için `null` gönderilirse o filtre kaldırılmalı (değeri `null` olmalı). Alan hiç gönderilmezse mevcut değer korunmalı.
- Her değişiklikten sonra `page` 1 olmalı.
- Mevcut filtre nesnesi değiştirilmemeli; yeni nesne dönmeli.

## Örnek

Mevcut: `{ genreId: 18, year: 1999, sortBy: 'popularity.desc', page: 5 }`

| Değişiklik | Sonuç |
| --- | --- |
| `{ year: 2008 }` | `{ genreId: 18, year: 2008, sortBy: 'popularity.desc', page: 1 }` |
| `{ genreId: null }` | `{ genreId: null, year: 1999, sortBy: 'popularity.desc', page: 1 }` |

## Sözleşme

- Dosya: `task.ts`
- Export tipleri: `SortBy`, `DiscoverFilters` (değiştirme), `FilterChange`.
- Export fonksiyon: `applyFilterChange(current: DiscoverFilters, change: FilterChange): DiscoverFilters`.
