Yavaş yanıt sırasında tek kartta 8,5 puanın gönderildiğini hemen göster. Sunucu reddederse geçici metin kaybolsun.

## Gereksinimler

- “8,5 ver” tıklanınca `rate({ movieId, value: 8.5 })` çağrılsın.
- İstek pending iken “8,5 gönderiliyor” metni görünsün.
- Hata olursa pending metni kalksın ve `role="alert"` içinde “Kaydedilemedi” gösterilsin.
- Query cache’ine optimistic değer yazılmasın.

## Örnek

550 numaralı filmde düğmeye tıklandığında bekleme metni hemen belirir; Promise reject olunca metin yerini hata mesajına bırakır.

## Sözleşme

- `PendingRating.tsx` dosyasından `PendingRating({ movieId, rate })` named export et.
- `rate(input: { movieId: number; value: number }): Promise<void>`.
- Düğmenin başlangıç adı “8,5 ver” olsun.
