Puan POST’u başarılı oldu ama açık Puanladıklarım listesi boş kaldı. Yazma sonrası ilgili liste sunucuyla yeniden uzlaşsın.

## Gereksinimler

- Verilen `rate` asenkron fonksiyonu mutation olarak çalıştırılsın.
- Başarılı yazma yalnızca `['ratings', sessionId]` key’iyle başlayan query’leri geçersiz kılsın.
- `onSuccess` callback’i yenileme Promise’ini döndürsün; aktif listenin GET’i bitene kadar mutation pending kalsın.
- Mutation hatasında bu başarılı yazma davranışı çalışmasın.

## Örnek

Session `guest-1` için puan POST’u tamamlanınca `['ratings', 'guest-1']` stale olur; `guest-2` listesi etkilenmez.

## Sözleşme

- `useRate.ts` dosyasından `useRate(rate, sessionId)` named export et.
- `rate(input: { movieId: number; value: number }): Promise<void>`.
- Hook sonucu mutation sonucu olsun ve `mutate` içersin.
