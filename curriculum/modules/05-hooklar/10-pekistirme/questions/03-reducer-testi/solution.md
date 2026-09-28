## Neden böyle?

Reducer testi bir kullanıcı akışını küçük ve kesin geçişlere böler. Burada `toEqual` iyi çalışır çünkü state nesnesinin tamamı sözleşmenin parçası: eski sonuçların temizlenmesi veya `error` alanının `null` olması gözden kaçmasın.

Her test tek action'ı çalıştırıyor. Böylece bir mutant başarısız olduğunda hangi geçişin bozulduğu hemen okunur. Bileşen testi yazsaydık aynı hatayı yakalayabilirdik, ama hata mesajı "ekranda şu yok" diye dolaylı olurdu. Saf reducer için en ucuz ve en net güvence doğrudan reducer testidir.
