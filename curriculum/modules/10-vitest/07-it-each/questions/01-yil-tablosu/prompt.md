TMDB’de `release_date` kimi filmde boş; bazısında tam tarih. `@impl/releaseYear` fonksiyonu bu farkı karta uygun string’e çeviriyor. Tekrarlı test gövdeleri yerine **tek `it.each` tablosu** yaz.

| `release_date` | Beklenen |
| --- | --- |
| `""` | `""` |
| `"1999-10-15"` | `"1999"` |
| `"2024-01-01"` | `"2024"` |

Başlık her satırın girdisini içersin. Doğru sürümde bütün satırlar geçmeli; iki hatalı sürümden en az bir satır kırılmalı.
