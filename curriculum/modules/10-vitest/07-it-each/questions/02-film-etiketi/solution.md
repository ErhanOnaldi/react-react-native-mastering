## Neden böyle?

Önce `trim` uygulamak hem tarihli hem tarihsiz dalda aynı başlığı verir. Boş tarih için erken dönüş, gereksiz boş parantezi önler. `new Date("")` ile yıl çıkarmaya çalışmak yerine TMDB’nin ISO tarih metnindeki ilk dört karakteri almak bu sözleşme için yeterlidir.

`it.each` her satıra ayrı sonuç verir; `Matrix` satırı bu kez başlık temizliğini de ekler, boş tarih satırı ise kartta görünür eksik veri hatasını yakalar. Daha sonra sayfalama testlerinde aynı tablo tekniğini dizilerin sınırına uygulayacaksın.
