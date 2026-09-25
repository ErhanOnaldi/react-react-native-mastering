Ağ mantığı hook’a taşındı. Şimdi bileşen yalnız hangi durumda ne görüleceğini söylesin.

## İstenen

`MovieResult({ state })` şu görünümü versin:

| Durum | Görünüm |
| --- | --- |
| `loading` | `Filmler yükleniyor` metni |
| `error` | `Hata: <message>` |
| `success`, boş liste | `Film bulunamadı` |
| `success`, dolu liste | Her film için `<li>` içinde başlık |

Başarı listesindeki `key` film id’si olsun. Union tipini starter’da hazır verdik.
