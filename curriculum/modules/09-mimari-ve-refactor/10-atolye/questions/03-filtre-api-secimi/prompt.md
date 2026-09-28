Keşif ekranında tür ve sıralama seçimini birlikte yönet. Seçim görünür kalsın ve tek bir sıfırlama eylemi varsayılanlara dönsün.

## Gereksinimler

- Accessible name'i `Tür` olan seçimde Aksiyon (`28`) ve Komedi (`35`) seçenekleri bulunsun.
- Accessible name'i `Sıralama` olan seçimde Popüler (`popularity.desc`) ve Başlık (`title.asc`) seçenekleri bulunsun.
- Seçili değerler native seçim kontrollerinde görünür olsun.
- `Sıfırla` eylemi türü `28`, sıralamayı `popularity.desc` yapsın.
- Seçim için ağ isteği gerekmesin.

## Örnek

Komedi ve Başlık seçtikten sonra değerler sırasıyla `35` ve `title.asc` olur. Sıfırla sonrası `28` ve `popularity.desc` görünür.

## Sözleşme

- Dosya ve export: `DiscoverFilters.tsx` → named export `DiscoverFilters`.
- İki native combobox'ın accessible name'i `Tür` ve `Sıralama`; eylem düğmesinin adı `Sıfırla`.

## Kısıtlar

- API tasarımını kod yorumunda gerekçelendir: seçimler tek bir değer olarak mı, ayrı kontrollü parçalar olarak mı sunuluyor?
