TMDB bazı filmleri `release_date: ""` ile gönderir. Kartta `"Film ()"` görünmesin. Bu kez testler hazır; aynı kuralın birkaç veri örneğiyle nasıl `it.each` içinde okunduğunu görüp `movieLabel.ts` dosyasını tamamla.

## Sözleşme

`movieLabel({ title, release_date })` bir string döndürsün:

| Film | Beklenen |
| --- | --- |
| `{ title: "Dövüş Kulübü", release_date: "1999-10-15" }` | `"Dövüş Kulübü (1999)"` |
| `{ title: " Matrix ", release_date: "1999-03-31" }` | `"Matrix (1999)"` |
| `{ title: "Yeni Film", release_date: "" }` | `"Yeni Film"` |

Başlıktaki kenar boşluklarını kaldır. Eksik tarih için yıl parantezi üretme. Testteki her tablo satırı ayrı bir davranış örneği olarak raporlanır.
