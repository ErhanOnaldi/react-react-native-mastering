Silme ekranındaki onay penceresi, düzenleme ekranındakiyle aynı kapatma ve odak davranışını göstermeli. İki akışta da onay penceresi tutarlı çalışsın.

## Gereksinimler
- Üstteki `Düzenleme` ve `Silme` düğmeleri ilgili ekranı açsın.
- Düzenleme ekranındaki `İptal` düğmesiyle açılan pencere Escape ile kapansın ve focus `İptal` düğmesine dönsün.
- Silme ekranındaki her `Sil` düğmesi aynı görünüm ve davranışta pencere açsın.
- Silme penceresinde Escape ile kapanınca focus onu açan `Sil` düğmesine dönsün; kayıt ekranda kalsın.
- `Evet, sil` seçilince pencere kapansın ve ilgili kayıt listeden kaldırılsın.

## Örnek
Silme ekranında ilk kaydın `Sil` düğmesine bas → pencere açılır → Escape → pencere kapanır, focus aynı düğmeye döner ve iki kayıt görünür.

## Sözleşme
- `DialogPages.tsx` → named export `DialogPages`.
- Düzenleme ve silme ekranı ile kontrollerin erişilebilir adları `Düzenleme`, `Silme`, `İptal`, `Sil` ve `Evet, sil` olarak kalır.
