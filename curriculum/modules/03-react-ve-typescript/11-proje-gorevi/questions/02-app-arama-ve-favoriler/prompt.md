Artık parçaları `src/App.tsx` içindeki **default export `App`** ile birleştir.

- Önceki görevdeki `sampleMovies`, `MovieGrid`, `SearchBox` bileşenlerini kullan. Var olan Sinema başlığını koru.
- Sorgu ve favori id’leri için state **App’te** olsun. `SearchBox` controlled kalsın.
- Her render’da `sampleMovies` listesini başlığa göre filtrele. Büyük/küçük harfe duyarsız karşılaştır; sorgunun baş/son boşluklarını yoksay. Ağ isteği atma.
- Favoriye ekleme/çıkarma yeni dizi döndüren updater ile yapılsın. Arama ile film gizlenip geri gelse de favori işareti korunmalı. Bir filmin değiştirilmesi diğerini etkilememeli.
- `MovieGrid` boş sonuç için “Film bulunamadı” gösterebilmeli.

Deneme sırası: Dövüş Kulübü’nü favorile → “Matrix” ara → aramayı temizle. İlk filmin favori düğmesi hâlâ basılı olmalı. Sonra tekrar tıkla; basılı durum kalkmalı.
