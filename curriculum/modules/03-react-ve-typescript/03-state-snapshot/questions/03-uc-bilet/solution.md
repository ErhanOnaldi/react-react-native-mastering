## Neden böyle?

`count` bir render snapshot’ıdır. `setCount(count + 1)` üç kez aynı 1 değerini sıraya koyar. Updater’lar ise sırayla 0→1→2→3 hesaplar. Tek seferde `setCount(n => n + 3)` de bu özel ihtiyaçta doğrudur; üç updater burada queue modelini görünür kılmak için kullanıldı. Sonraki favori görevinde yine eski state’e bağlı güncelleme gerekir.
