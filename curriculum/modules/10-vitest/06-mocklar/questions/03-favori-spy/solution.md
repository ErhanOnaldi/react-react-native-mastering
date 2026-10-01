## Neden böyle?

Bu test hem kalıcı verinin anahtarını hem de tekrar ekleme davranışını ölçer. Yalnızca “`setItem` çağrıldı” demek yanlış anahtarı ve duplicate filmi kaçırır. `mockRestore` metodu geri koyar; global saklama durumunu testler arasında temizlemek de test bağımsızlığı sağlar. İleride favoriler Context veya Redux içine taşınsa bile bu kullanıcı sözleşmesi değerlidir.
