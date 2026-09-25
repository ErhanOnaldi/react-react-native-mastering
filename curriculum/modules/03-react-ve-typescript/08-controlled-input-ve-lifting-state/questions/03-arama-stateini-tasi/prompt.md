Arama kutusu ve listeyi ortak state ile bağla. `SearchableMovies` 550 Dövüş Kulübü, 155 Kara Şövalye, 603 Matrix filmlerini statik olarak kullanır. “Film ara” input’una yazdıkça başlıkta büyük/küçük harfe duyarsız filtrele. Boş sonuçta “Film bulunamadı” göster. Görünür listeyi ayrı state’e kopyalama; render’da `filter` ile üret.

**Örnek:** “kara” yaz → yalnız Kara Şövalye; input’u temizle → üç film.
