## Neden böyle?

HTTP 200 yalnızca taşımanın başarılı olduğunu söyler. Şema parse'i UI ve Query cache'inden önce çalışırsa bozuk veri hata durumuna dönüşür. Büyük uygulamada bu kontrol genel `tmdbClient.get(path, schema)` imzasına taşınır.

## Alternatif, tuzak ve devamı

`as Movie` yalnızca derleyiciyi susturur. HTTP hatası ile veri hatasını aynı mesajda eritme; izleme ve kullanıcı mesajı için farklı bağlam gerekir. Proje görevinde bu kalıbı genel `tmdbClient.get(path, schema)` imzasına taşıyacaksın.
