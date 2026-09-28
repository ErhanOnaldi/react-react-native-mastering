Kullanıcı hatalı kimlik bilgisi girdiğinde yazılan kullanıcı adını silmeyen, anlaşılır bir hata uyarısı gösteren ve istek sürerken mükerrer tıklamaları engelleyen dayanıklı bir giriş paneli bileşeni oluştur.

## Gereksinimler

- Bileşende kullanıcı adı ve şifre giriş alanları ile bir gönderim butonu bulunmalıdır.
- Yanlış bilgilerle giriş denendiğinde ekranda erişilebilir bir hata uyarısı (`role="alert"`) görünmeli; ancak kullanıcının yazdığı kullanıcı adı alanı sıfırlanmamalı, değerini korumalıdır.
- Şifre düzeltilip tekrar gönderildiğinde giriş başarıyla tamamlanmalı ve kullanıcı adı ekranda gösterilmelidir.
- Ağ isteği devam ederken butona art arda tıklanması durumunda sunucuya ek istekler gönderilmemeli, işlem tek bir istekle yürütülmelidir.

## Örnek

| Eylem | Beklenen Davranış |
| --- | --- |
| Yanlış şifreyle gönderim | `alert` uyarısı çıkar, `Kullanıcı adı` girdisindeki metin korunur. |
| Şifreyi düzeltip tekrar gönderim | Kullanıcı profili ekrana gelir (`"emilys"` metni görünür). |
| İstek sürerken butona çift tıklama | Sunucuya fazladan istek gitmez (ağda tam 1 login isteği). |

## Sözleşme

- `LoginPanel.tsx` dosyasından `LoginPanel` bileşenini named export et.
- Arayüz öğeleri:
  - Kullanıcı adı alanı: `Kullanıcı adı` etiketine sahip input
  - Şifre alanı: `Şifre` etiketine sahip input
  - Gönderim düğmesi: `Giriş yap` adında buton
  - Hata uyarısı: `role="alert"` özniteliğine sahip bildirim kutusu

## Kısıtlar

- Ağ isteği sürerken formun tekrar gönderilmesine izin verilmemelidir.
