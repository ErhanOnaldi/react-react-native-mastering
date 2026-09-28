Film bulunamadığında client HTTP ve servis hata ayrıntılarını çağırana taşımalı. Test, genel bir hata yerine bu değerlerin korunduğunu doğrulasın.

## Gereksinimler

- 404 cevabında gövde status_code 34 ve status_message Film bulunamadı içermeli.
- Film isteği reddedilmeli.
- Hata status 404, statusCode 34 ve message Film bulunamadı alanlarını taşımalı.
- Test sonunda global fetch geri alınmalı.

## Örnek

Girdi: film id 999999.
Yanıt: HTTP 404, servis kodu 34, mesaj Film bulunamadı.
Beklenen hata nesnesi bu üç ayrıntıyı korur.

## Sözleşme

- Yazılacak dosya: errorClient.test.ts
- Test edilecek modül: @impl/errorClient
- Çağrı: getMovie(id: number)
