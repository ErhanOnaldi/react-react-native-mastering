`selectedMovie` state'i yenilemede siliniyordu. `/movie/550` adresi tek başına Dövüş Kulübü'nü açmalı.

## Görev

`MovieDetails` içinde `useParams<'id'>()` ile id oku. Geçersiz biçimde **Geçersiz film adresi**, geçerli ama `movies` içinde bulunmayan id'de **Film bulunamadı** göster. Bulunan filmin `title` değerini `<h1>` içinde yaz.

Örnek: `/movie/603` → Matrix; `/movie/xyz` → geçersiz adres.
