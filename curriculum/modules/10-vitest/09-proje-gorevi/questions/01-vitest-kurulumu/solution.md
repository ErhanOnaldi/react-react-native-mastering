## Neden böyle?

`vitest run` tek sefer çalışır ve hata varsa başarısız çıkış kodu üretir; bu yüzden otomasyona uygundur. `vitest` komutu geliştirme sırasında dosyaları izleyip değişiklik olduğunda testleri yeniden çalıştırabilir. `jsdom` ise sonraki görevde `useDebounce` hook’unu DOM ortamında denemeni sağlar.

`toBe` burada string sözleşmesini tam ölçer. Yalnızca `toContain('8')` yazmak, `"8"` ile `"8.0"` farkını kaçırır. `formatDate` için boş durum da gerçek TMDB verisinden gelir; yalnızca dolu tarih testi bu sınırı korumaz.

Test dosyasının varlığı tek başına güvence değildir. Proje testleri temel dosya ve davranış sözleşmesini kontrol eder; kendi testlerinin bir hatayı yakaladığını yanlış beklenen değerle kırmızı sonucu görerek doğrula. Sonraki görev aynı düzeni ağ ve zaman sınırlarına taşıyacak.
