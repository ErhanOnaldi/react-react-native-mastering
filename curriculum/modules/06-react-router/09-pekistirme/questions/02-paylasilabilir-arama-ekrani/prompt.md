Arama ekranı, aynı query string ile her açılışta aynı filtreli sayfayı ve film listesini göstermeli.

## Gereksinimler

- `Film ara` adlı input `q` değerini, `Tür` adlı select `genre` değerini URL'den göstersin. Seçenekler: `Tüm türler` (boş) ve `Aksiyon` (`28`).
- Filmleri önce başlıkta Türkçe büyük/küçük harfe duyarsız arama ve türle filtrele, sonra sayfala. Sonuçları `<ul>` içinde `<li>` öğeleri olarak göster.
- `page` eksik veya geçersizse 1 kabul et ve `Sayfa N` metnini göster.
- Sorgu veya tür değişince `page` parametresini kaldır; diğer filtre değerini koru.
- `Sonraki sayfa` seçilince page değerini artır ve q ile genre değerlerini koru.
- Sonuç yoksa `Film bulunamadı` metnini göster.

## Örnek

`?q=a&genre=28&page=2` → Aksiyon filmlerinin arama eşleşmeleri arasından ikinci sayfa.

## Sözleşme

- `SearchPage.tsx` → named export `SearchPage`.
- Prop'lar: `movies: { id: number; title: string; genre_ids: number[] }[]`, `pageSize: number`.
- Input erişilebilir adı `Film ara`; select adı `Tür`; düğme adı `Sonraki sayfa`.
