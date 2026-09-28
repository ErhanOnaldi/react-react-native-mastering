Bir puan isteği beklerken düğme durumunu belli etmiyor. İşlem sırasında, başarıda ve hatada kullanıcıya doğru sonucu gösteren bileşeni oluştur.

## Gereksinimler

- “8,5 ver” düğmesine tıklanınca `rate` fonksiyonu `{ movieId, value: 8.5 }` ile çağrılsın.
- İstek sürerken düğme disabled olsun ve adı “Kaydediliyor…” olsun.
- Başarıdan sonra “Kaydedildi” metni görünsün.
- Hata sonrası `role="alert"` içeren “Puan kaydedilemedi” metni görünsün.
- İlk render sırasında `rate` çağrılmasın.

## Örnek

550 numaralı film için “8,5 ver” tıklanır; beklerken düğme kilitlenir, sonra başarı ya da hata metni görünür.

## Sözleşme

- `RateButton.tsx` dosyasından `RateButton({ movieId, rate })` named export et.
- `movieId: number`; `rate(input: { movieId: number; value: number }): Promise<void>`.
- Düğme adı başlangıçta “8,5 ver” olsun.
