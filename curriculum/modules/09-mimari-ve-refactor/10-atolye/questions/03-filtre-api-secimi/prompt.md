Keşif ekranında kullanıcı tür ve sıralamayı birlikte ayarlıyor. Filtre alanı için iki uygulanabilir tasarım var: tüm seçimleri tek bir değer olarak taşımak veya her seçimi ayrı parçanın sunduğu bir düzen kurmak. Birini seç, uygula ve seçimini kod yorumunda gerekçelendir.

Testler `DiscoverFilters.tsx` içindeki `DiscoverFilters` bileşenini açar.

- `Tür` seçiminde `Aksiyon` (28) ve `Komedi` (35) bulunsun.
- `Sıralama` seçiminde `Popüler` (`popularity.desc`) ve `Başlık` (`title.asc`) bulunsun.
- `Sıfırla` varsayılanlara dönsün. Seçili değerler ekranda okunabilsin.
- Tür seçenekleri TMDB tür verisine karşılık gelir; bu görevde ağ isteği gerekmez.
