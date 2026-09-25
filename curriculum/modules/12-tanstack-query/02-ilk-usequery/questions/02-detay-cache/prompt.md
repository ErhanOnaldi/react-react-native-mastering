Sinema detayından geri dönüp yeniden açınca aynı GET artıyor. Bu görevde ilk cache kazancını **istek sayarak** göster.

## İstenen

- `MovieDetail({ id })` filmin Türkçe başlığını `<h2>` içinde göstersin.
- İlk yüklemede `Yükleniyor`, hata durumunda `Hata: ...` göster.
- Key id’yi içersin; aynı id’ye 60 saniye içinde dönünce yeni GET gitmesin.
- `getMovie` Bearer başlığıyla TMDB’den çeksin; HTTP hatasını fırlatsın.

Önizlemede id’ler arasında geçip geri dön; istek sayacının taze filme dönüşte artmadığını izle.
