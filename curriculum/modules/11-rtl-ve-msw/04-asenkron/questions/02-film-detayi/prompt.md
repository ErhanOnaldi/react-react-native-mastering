Film kimliği verildiğinde film başlığını API’den getir ve bekleme ile hata durumlarını kullanıcıya açıkça göster.

## Gereksinimler
- İlk istek sürerken “Yükleniyor” metni status rolüyle görünür.
- Başarılı yanıtın `title` değeri `h2` başlığında görünür.
- HTTP veya ağ hatasında “Film yüklenemedi” alert’i görünür.
- `id` değişince yeni filmin başlığı görünür; eski yanıt güncel sonucu ezmemelidir.
- Bir film id’si için yalnızca bir istek gönderilir.
- İstek `Authorization: Bearer test-token` başlığını taşır.

## Örnek
`id=550` → önce “Yükleniyor” → sonra “Dövüş Kulübü”.

## Sözleşme
- `MovieTitle.tsx` dosyasında `MovieTitle({ id }: { id: number })` bileşenini export et.
- İstek adresi `${TMDB_BASE}/movie/${id}`.
- Status rolü, heading rolü ve alert rolüyle belirtilen metinler DOM’da bulunur.
