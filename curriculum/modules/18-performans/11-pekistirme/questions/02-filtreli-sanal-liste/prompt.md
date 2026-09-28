Katalogdaki sanal liste, arama daralınca eski indeksleri yeni başlıklarla eşleştiriyor. Sorgu değiştiğinde yalnız eşleşen filmleri ve onların kararlı satır kimliklerini göster.

## Gereksinimler
- Başlık eşleşmesi Türkçe duyarlı olmalı.
- Görünen satırlar yalnız filtrelenmiş filmlerden gelmeli.
- Sorgu değişince eski satırlar kalkmalı.
- Satır kimliği film id'si olmalı.
- 500 filmde 30'dan az DOM satırı, tek eşleşmede tek satır bulunmalı.

## Örnek
500 filmlik listede boş sorgu sanal pencere kadar satır gösterir. Dövüş sorgusu yalnız Dövüş Kulübü satırını bırakır.

## Sözleşme
- Dosya ve export: FilteredVirtualMovies.tsx → FilteredVirtualMovies({ movies, query })
- Props: movies: { id: number; title: string }[], query: string
- Arayüz: role="list" kapsayıcısı ve role="listitem" satırları.
