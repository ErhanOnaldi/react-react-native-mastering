Giriş yapınca profil görünüyor. Bir süre sonra oturumun süresi doluyor; kullanıcı "Profili yenile" düğmesine bastığında ekran sonsuza dek "Yükleniyor" yazısında kalıyor, hiçbir hata veya kurtarma olmuyor.

Ayrıca: bir kullanıcı önce yanlış bilgilerle giriş denerse hata mesajı görünüyor; doğru bilgilerle tekrar denediğinde profil gelse bile eski hata mesajı ekranda kalmaya devam ediyor.

`SessionPanel.tsx` içindeki `SessionPanel` bileşenini düzelt: oturum süresi dolduğunda uygulama kendini toparlayabilsin, yeni bir giriş denemesi de her zaman temiz bir ekrandan başlasın.

Test hesabı: `emilys` / `emilyspass`.
