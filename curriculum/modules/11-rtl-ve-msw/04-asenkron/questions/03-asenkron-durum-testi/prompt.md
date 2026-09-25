## Sorun
Film yüklenince başlık görünmesi tek başına yeterli değil. Beklerken boş ekran ve 500 yanıtında sessiz hata kullanıcıyı yanıltır.

## Görev
`@impl/MovieStatus` için iki test yaz. Gecikmeli MSW yanıtı kur; istek sürerken "Yükleniyor" status’ünü, sonra Dövüş Kulübü başlığını gör. Ayrı testte `server.use` ile `/movie/550` için 500 döndür ve "Film yüklenemedi" alert’ini bekle.

## Örnek
`<MovieStatus id={550} />` → loading → heading; 500 → alert. Header’ın Bearer token taşıdığını unutma.
