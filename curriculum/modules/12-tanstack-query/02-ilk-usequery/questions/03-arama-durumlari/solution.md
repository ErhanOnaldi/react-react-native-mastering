## Neden böyle?

`status` ayrımlı union olduğundan success dalında `data` tanımlıdır. Boş cevap ile HTTP hatası ayrı kullanıcı durumlarıdır. Dört sayfada bu dallar ortak veri modelinden gelir; görünüm metnini yine sayfa bağlamına göre seçersin. İleride mutation hataları aynı sorgu status’u değildir.
