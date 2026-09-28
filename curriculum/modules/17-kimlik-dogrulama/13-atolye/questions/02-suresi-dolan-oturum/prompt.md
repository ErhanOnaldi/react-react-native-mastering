Giriş yapıldığında profil görüntüleniyor. Ancak bir süre sonra oturumun süresi dolduğunda, kullanıcı "Profili yenile" düğmesine bastığında ekran sonsuza dek "Yükleniyor" durumunda takılı kalıyor; hiçbir yenileme veya kurtarma gerçekleşmiyor. Ayrıca başarısız bir giriş denemesinin ardından doğru bilgilerle tekrar giriş yapıldığında, eski hata mesajı ekrandan silinmeyip asılı kalmaya devam ediyor.

## Gereksinimler

- Oturum süresi dolduğunda profil yenileme eylemi kilitlenmemeli; eldeki yenileme belirteci ile yeni bir oturum çifti alınarak profil isteği otomatik olarak tekrarlanmalıdır.
- Hatalı kimlik bilgileriyle giriş denendiğinde okunabilir bir hata uyarısı (`role="alert"`) gösterilmelidir.
- Başarısız bir denemenin ardından doğru bilgilerle tekrar giriş yapıldığında önceki hata uyarısı ekrandan tamamen temizlenmelidir.
- Başarılı girişte profil bilgileri ekranda görünmelidir.

## Örnek

| Durum | Beklenen Davranış |
| --- | --- |
| Süresi dolmuş oturumda "Profili yenile" tıklanması | Ekran sonsuza dek yüklenmede kalmaz; arka planda 1 yenileme isteği atılır ve `"Merhaba, emilys"` yeniden gösterilir. |
| Yanlış şifreyle giriş denemesi | Ekranda `alert` uyarısı belirir. |
| Hemen ardından doğru şifreyle giriş | `"Merhaba, emilys"` ekrana gelir ve önceki `alert` uyarısı tamamen kaybolur. |

## Sözleşme

- `SessionPanel.tsx` dosyasından `SessionPanel` bileşenini named export et.
- Props sözleşmesi:
  - `sessionMinutes?: number`
- Arayüz öğeleri:
  - Kullanıcı adı alanı: `Kullanıcı adı` etiketine sahip input
  - Şifre alanı: `Şifre` etiketine sahip input
  - Gönderim düğmesi: `Giriş yap` adında buton
  - Yenileme düğmesi: `Profili yenile` adında buton
  - Başarı metni: `"Merhaba, <username>"`
  - Hata uyarısı: `role="alert"` içeren bildirim kutusu
