Sinema’nın liste özeti yardımcı fonksiyonu `total_results` değerinden toplam sayfayı çıkarıyor. Nesnenin her alanını kopyalayan kırılgan test yerine, sayfalamanın kullanıcıya görünen alanlarını yaz.

`@impl/summarizeMovies` içindeki `summarizeMovies({ page, total_results, results })` fonksiyonunu test et.

- 41 sonuç ve 20’lik sayfa boyutunda ikinci sayfanın özetini sınayacaksın.
- `page` değerini ve `total_pages` değerini **ayrı ayrı** güvenceye al.
- Sonuç nesnesi ileride ek alanlar taşıyabilir; yalnızca sözleşmeye ait alanları karşılaştır.

Beklenen ilgili alanlar: `{ page: 2, total_pages: 3 }`. Testler doğru sürümde geçip iki tekil hatayı yakalamalı.
