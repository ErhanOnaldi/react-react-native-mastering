Açılan düzenleme penceresi, üstünde çalışılan kaydı doldursun. Pencere açıkken kullanıcı başka bir kaydı seçerse pencere yeni kaydın değerleriyle güncellensin — önceki kaydın verisi kalmasın. Geçersiz bir bilgiyle kaydetmeye çalışılırsa hata okunabilir olsun ve odak ilgili alana gitsin.

## Giriş ve davranış

Testler `EditDialog.tsx` içindeki `EditDialog` bileşenini açar; bileşen `open`, `record`, `onOpenChange` ve `onSave` bilgisiyle çağrılır.

- `record` içindeki ad ve e-posta alanları pencerede görünür.
- Farklı bir `record` ile yeniden çağrıldığında pencere hâlâ açıksa alanlar yeni kayda göre güncellenir.
- Ad boşsa ya da e-posta geçerli bir biçimde değilse: okunabilir bir hata mesajı görünür, `onSave` çağrılmaz ve odak sorunlu alana gider.
- Geçerli girişte `onSave` güncel değerlerle çağrılır.

Örnek: Ada'nın kaydı açık → Grace'in kaydı seçilir → pencere Grace'in adını ve e-postasını gösterir.
