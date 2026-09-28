Detay ekranı geçerli film kimliğini göstermeli, aramaya dönüş bağlantısı sunmalı ve kimlik olmadığında anlaşılır bir durum göstermelidir.

## Gereksinimler
- `/movie/550` adresinde `Film #550` başlığı görünür.
- “Aramaya dön” bağlantısı `/search` sayfasına geçer.
- Link kullanımı sayfayı tam yenilemeden route’u değiştirir.

## Örnek
`/movie/603` → `Film #603`; bağlantıya tıkla → `/search` ve “Arama” başlığı.

## Sözleşme
- `MovieRoute.tsx` dosyasında `MovieRoute` bileşenini export et.
- Sayfa `/movie/:id` route’u içinde render edilir.
- Başlık heading, dönüş kontrolü link rolüyle bulunabilmelidir.
