## Neden böyle?
Testte küçük bir `Harness`, `onChange` değerini state'e yazar; bu sayede arama alanı kontrollü biçimde yeniden render olur. `user.type` ve Enter gerçek klavye etkileşimini çalıştırır. `trim()` baştaki ve sondaki boşlukları kaldırır; yalnız boşluklardan oluşan arama da gönderilmez.
