## Sorun
Detay sayfası URL’de 550 varken hep ilk filmi gösteriyor; dönüş linki de normal `<a>` ile sayfayı yeniliyor.

## Görev
`MovieRoute` bileşeni URL’deki `id` için `Film #550` biçiminde `h1` göstersin. `/search` adresine sayfayı yenilemeden giden "Aramaya dön" bağlantısı koy. Eksik id için "Film seçilmedi" yaz. Test route’u memory router’dan verir.

## Örnek
`/movie/603` → `Film #603`; link tıklanınca `/search`.
