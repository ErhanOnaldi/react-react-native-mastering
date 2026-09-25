Önizlemede Dövüş Kulübü düğmesine bas: starter diziyi `push` ile değiştiriyor ve aynı referansı state’e veriyor; işaret yenilenmiyor. `FavoriteShelf` içinde 550 ve 155 id’li iki film göster. Her film için düğme adı film başlığı + “Favoriye ekle” veya “Favoriden çıkar” olsun; `aria-pressed` doğru değeri taşısın. Tıklama ekle/çıkar yapsın; diğer filmin durumu korunsun. Yeni dizi döndüren updater kullan.

**Örnek:** Dövüş Kulübü ekle → `aria-pressed="true"`; aynı filme tekrar bas → `false`.
