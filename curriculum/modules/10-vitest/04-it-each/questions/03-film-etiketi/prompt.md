Film kartı etiketi başlığın kenar boşluklarını kaldırmalı ve çıkış yılı varsa başlığın yanına eklemeli. Tarih yoksa boş parantez üretmemeli. Bu davranışı aynı kuralı farklı girdilerle çalıştıran test tablosuyla güvenceye al.

## Gereksinimler

- Dolu tarihten ilk dört karakter yılı alınmalı.
- Başlığın başındaki ve sonundaki boşluklar kaldırılmalı.
- Tarih boşsa yalnız temizlenmiş başlık dönmeli.
- Test başlığı her satırın girdi ve beklenen değerini göstermeli.

## Örnek

| Film | Beklenen |
| --- | --- |
| Dövüş Kulübü, 1999-10-15 | Dövüş Kulübü (1999) |
| “ Matrix ”, 1999-03-31 | Matrix (1999) |
| Yeni Film, boş tarih | Yeni Film |

## Sözleşme

- Yazılacak dosya: `movieLabel.test.ts`
- Test edilecek modül: `@impl/movieLabel`
- Export: `movieLabel(movie: { title: string; release_date: string }): string`
