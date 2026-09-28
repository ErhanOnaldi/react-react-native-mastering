## Neden böyle?

`aria-pressed`, düğmenin aç/kapa durumunu yardımcı teknolojilere de bildirir. Erişilebilir adın seçili duruma göre değişmesi, kullanıcıya yapılacak sonraki eylemi söyler. `type="button"` ise form içindeki varsayılan submit davranışını önler.

`onToggle` yalnızca eylemi üst bileşene bildirir; düğme kendi başına `isSaved` değerini değiştirmez. Böylece controlled prop tek doğruluk kaynağı olarak kalır.

## Alternatif ve tuzak

Tıklama işleyicisinde `isSaved` değerini değiştirmeye çalışmak işe yaramaz; boolean prop yerel state değildir. Üst bileşen callback’ten sonra yeni prop gönderir.

## Sektörde ve sonra

Bir bileşen testi rol, erişilebilir ad, ARIA durumu ve kullanıcı tıklamasını birlikte denetleyebilir. Aynı tercih, arayüzü klavye ve ekran okuyucuyla kullanan kişilerin de kontrolü bulmasını kolaylaştırır.
