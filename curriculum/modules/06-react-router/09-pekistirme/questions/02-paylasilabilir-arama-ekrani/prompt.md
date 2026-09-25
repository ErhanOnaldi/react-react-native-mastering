Sinema araması artık paylaşılabilir: `/search?q=a&genre=28&page=2` açıldığında aynı filtreli ikinci sayfa görünmeli. Sorgu değişirken eski sayfa numarası kalırsa boş sonuç yanılsaması oluşur.

## Görev

`SearchPage({ movies, pageSize })` için URL tek kaynak olsun:

- `q` input'u ve `genre` select'i URL değerlerini göstersin. Tür seçenekleri: Tüm türler (boş) ve Aksiyon (`28`).
- Filmleri önce Türkçe duyarsız başlık ve seçili türle filtrele, sonra `pageSize` kadar sayfala. Liste `<ul>` / `<li>` içinde olsun.
- `page` yoksa veya geçersizse 1 kabul et; görünür `Sayfa N` yaz.
- Sorgu ya da tür değişince `page` silinsin, diğer filtre korunsun.
- Sonraki sayfa tıklanınca yalnızca `page` artsın; q ve genre kalsın.
- Boş sonuçta `Film bulunamadı` göster.

Örnek: `?q=a&genre=28&page=2` için Aksiyon filmlerinin filtrelenmiş ikinci sayfası görünür.
