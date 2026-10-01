Sinema’nın puan isteği hazır: `rate` sunucuya puanı kaydeden ve hata halinde reddedilen bir Promise döndürüyor. Bu işi başlatan hook’u kur; bileşen yalnızca kullanıcı tıklayınca isteği gönderebilsin.

## Gereksinimler

- `rate` fonksiyonu mutation işlemi olarak kullanılsın.
- Dönen sonuçta `mutate` bulunsun ve `{ movieId, value }` değişkenlerini kabul etsin.
- Hook çağrısı tek başına `rate` çağırmasın.
- `mutate({ movieId: 550, value: 8.5 })` çağrısı aynı nesneyi `rate` fonksiyonuna iletsin.

## Sözleşme

- `useRate.ts` dosyasından `useRate(rate)` named export et.
- `rate(input: { movieId: number; value: number }): Promise<void>`.
