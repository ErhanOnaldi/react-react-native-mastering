Kullanıcı başka route’a geçtiğinde bile başarısız mutation ortak bir bildirim üretmeli. Tek bir QueryClient fabrikası oluştur.

## Gereksinimler

- Yeni bir `QueryClient` oluşturulsun.
- Her başarısız mutation’da `notify('İşlem kaydedilemedi')` tam bir kez çağrılsın.
- Query ve mutation retry varsayılanları kapalı olsun.
- Yerel mutation hata callback’leri ayrıca rollback yapabilsin.

## Örnek

Başarısız bir mutation Promise’i hata ile tamamlandığında bildirim callback’i tek kez çağrılır.

## Sözleşme

- `makeClient.ts` dosyasından `makeClient(notify)` named export et.
- `notify(message: string): void`; dönüş değeri `QueryClient`.
- Testte `notify` fonksiyonu tek bir metin argümanıyla çağrılır.

## Kısıtlar

- Bildirim metni tam olarak `İşlem kaydedilemedi` olsun.
