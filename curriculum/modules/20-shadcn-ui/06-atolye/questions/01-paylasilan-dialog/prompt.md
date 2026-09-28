Kayıt düzenleme ekranındaki onay penceresi doğru çalışıyor: Esc ile kapanıyor, kapanınca odak onu açan `İptal` düğmesine dönüyor. Aynı davranışı ikinci ekrandaki silme akışında da istiyoruz; şu an oradaki onay penceresi öyle davranmıyor.

## Giriş ve davranış

Testler `DialogPages.tsx` içindeki `DialogPages` bileşenini açar.

- Üstteki `Düzenleme` ve `Silme` düğmeleri ekran değiştirir.
- Düzenleme ekranındaki `İptal` düğmesi bir onay penceresi açar (bu davranış zaten doğru, bozulmamalı).
- Silme ekranındaki her kayıt için `Sil` düğmesi de aynı kapatma ve odak davranışına sahip bir onay penceresi açmalı: onaylanırsa kayıt silinir, vazgeçilirse kayıt kalır.
- İki ekranın onay penceresi aynı görünüme ve davranışa sahip olmalı.

Örnek: Silme ekranında bir kayda `Sil` bas → onay penceresi açılır → Esc'e bas → pencere kapanır, odak yine `Sil` düğmesinde olur.
