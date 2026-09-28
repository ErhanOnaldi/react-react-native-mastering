Puanladıklarım başka route’ta da görünüyor, bu yüzden geçici puan ortak listede hemen görünmeli. Başarısız yazmada önceki liste geri gelsin.

## Gereksinimler

- Cache key’i `['ratings', sessionId]`; değer `{ id, title, rating }[]`.
- `rate` fonksiyonu `{ movieId, value, title }` alır ve başarısız HTTP cevabında reject olur.
- İşlem başlamadan eski listeyi al; optimistic sonuçta kayıt yoksa ekle, varsa puanını güncelle.
- Hata halinde önceki cache değerini geri yükle.
- İşlem başarıyla ya da hatayla tamamlandığında ilgili listeyi yeniden doğrula.
- Başarısız POST sırasında optimistic puan önce görünmeli, hata sonrasında eski puan görünmeli.

## Örnek

Başlangıç `[{ id: 550, title: 'Dövüş Kulübü', rating: 7 }]`; 8,5 yazması pending iken listede 8,5 görünür, 500 sonrasında 7’ye döner.

## Sözleşme

- `useOptimisticRating.ts` dosyasından `useOptimisticRating(sessionId)` named export et.
- Hook sonucu mutation sonucu olmalı ve değişkenleri `{ movieId: number; value: number; title: string }` kabul etmeli.

## Kısıtlar

- Bu görevde aynı listeye eşzamanlı mutation gönderilmez.
