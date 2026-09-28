TMDB'den gelen film kaydını kart kullanmadan önce doğrula.

## Gereksinimler
- id pozitif tam sayı, title boş olmayan string olmalı.
- poster_path string veya null olabilir; alanın eksik olması geçersizdir.
- Geçerli girdide parse edilmiş film kaydını döndür; yanlış girdide hata üret.

## Örnek
{ id: 550, title: "Dövüş Kulübü", poster_path: null } kabul edilir. title null veya id 1.5 ise reddedilir.

## Sözleşme
- movie.ts dosyasında movieSchema ve parseMovie(raw: unknown) named export'larını tanımla.
- parseMovie başarılı olduğunda doğrulanmış kaydı döndürür.

