Arama ekranında başarı, boş sonuç ve sunucu hatası davranışını kullanıcı etkileşimiyle sınayan testler yaz.

## Gereksinimler
- Kullanıcı “Matrix” arar; önce loading, sonra Matrix başlığı görünür.
- Arama alanı “Film ara” adıyla, gönderme düğmesi “Ara” adıyla bulunur.
- Boş liste “Film bulunamadı” mesajını gösterir.
- Boş sonuç mesajı status rolüyle sunulur.
- 500 yanıtı “Arama başarısız” alert’ini gösterir.
- İstek `query=Matrix` değerini taşır.
- İki verilen mutant da en az bir testte başarısız olmalıdır.

## Örnek
`results=[Matrix]` → başlık görünür; `results=[]` → boş mesaj; HTTP 500 → alert.

## Sözleşme
- `SearchPanel.test.tsx` dosyasına test yaz.
- Component `@impl/SearchPanel` yolundan import edilir.
- Endpoint `${TMDB_BASE}/search/movie`; `@test-utils` MSW server ve request günlüğü sağlar.
- Fixture auth başlığı `Authorization: Bearer test-token` kullanır.
