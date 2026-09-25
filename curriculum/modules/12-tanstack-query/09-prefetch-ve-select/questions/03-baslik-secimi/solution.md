## Neden böyle?

`select` yalnız observer’ın okuduğu görünümü dönüştürür; cache ham cevabı tutar. Başka bir bileşen aynı key ile poster alanlarını okuyabilir. Dönüşüm tipi `queryFn` sonucundan çıkarılır; gerekmedikçe elle generic yazma.
