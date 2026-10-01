Dövüş Kulübü puanını kaldırırken kullanıcıya isteğin beklediğini ve sonucunu göster. İsteği yapan `remove` Promise’i başarısız olursa hata mesajı görünsün.

## Gereksinimler

- “Puanı sil” düğmesine tıklayınca `remove(movieId)` çağrılsın.
- İstek beklerken düğme devre dışı ve adı “Siliniyor…” olsun.
- Başarıdan sonra “Puan silindi” metni görünsün.
- Hata sonrası `role="alert"` içinde “Puan silinemedi” görünsün.
- İlk render sırasında `remove` çağrılmasın.

## Örnek

550 numaralı film için düğmeye basınca `remove(550)` çağrılır. Promise reddedilirse hata metni görünür.

## Sözleşme

- `DeleteRatingButton.tsx` dosyasından `DeleteRatingButton({ movieId, remove })` named export et.
- `movieId: number`; `remove(movieId: number): Promise<void>`.
