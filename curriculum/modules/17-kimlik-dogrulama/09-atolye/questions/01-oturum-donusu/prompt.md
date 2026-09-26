Kullanıcı normal şekilde giriş yaptığında profil doğru görünüyor. Ama tarayıcıda zaten geçerli bir oturum jetonu varken (örneğin sayfa yenilendiğinde) ekran profile hiç ulaşmıyor, giriş formunda kalıyor. Bunu fark edip tekrar bakınca ağ günlüğünde aynı profil isteğinin **iki kez** atıldığını görüyorsun.

`ProfileGate.tsx` içindeki `ProfileGate` bileşenini düzelt: bileşen zaten elinde bir oturum jetonu varken açılırsa profili otomatik göstersin, normal girişte de profil isteği yalnızca bir kez gitsin.

Test hesabı: `emilys` / `emilyspass`.
