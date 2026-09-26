## Sorun
Film yüklenince başlık görünmesi tek başına yeterli değil. Beklerken boş ekran ve 500 yanıtında sessiz hata kullanıcıyı yanıltır.

## Görev
`@impl/MovieStatus` için iki test yaz. Gecikmeli yanıt sırasında "Yükleniyor" status’ünü, yanıt gelince Dövüş Kulübü başlığını doğrula. `/movie/550` isteği 500 döndüğünde "Film yüklenemedi" alert’i görünmeli.

## Örnek
`<MovieStatus id={550} />` → loading → heading; 500 → alert. Header’ın Bearer token taşıdığını unutma.
