Film kartı etiketi başlığın kenar boşluklarını kaldırmalı ve çıkış yılı varsa başlığın yanına eklemeli. Tarih yoksa boş parantez üretme.

## Gereksinimler

- Dolu tarihten ilk dört karakter yılı alınmalı.
- Başlığın başındaki ve sonundaki boşluklar kaldırılmalı.
- Tarih boşsa yalnız temizlenmiş başlık dönmeli.

## Örnek

| Film | Beklenen |
| --- | --- |
| Dövüş Kulübü, 1999-10-15 | Dövüş Kulübü (1999) |
| “ Matrix ”, 1999-03-31 | Matrix (1999) |
| Yeni Film, boş tarih | Yeni Film |

## Sözleşme

- Düzenlenecek dosya: movieLabel.ts
- Export: movieLabel(movie: { title: string; release_date: string }): string
