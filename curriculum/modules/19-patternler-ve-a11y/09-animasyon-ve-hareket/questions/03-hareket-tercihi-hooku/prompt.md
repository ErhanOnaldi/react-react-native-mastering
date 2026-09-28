Uygulama, kullanıcının sistem hareket tercihi değiştiğinde animasyon kararını güncellemeli. Tercihi okuyan ve değişimini izleyen bir yardımcı oluştur.

## Gereksinimler

- İlk render'da sistemin azaltılmış hareket tercihini boolean olarak döndür.
- Sistem tercihi sonradan değişince yeni boolean değeri döndür.
- Bileşen kaldırıldığında olay dinleyicisini temizle.

## Örnek

Sistem tercihi `reduce` iken sonuç `true`; kullanıcı tercihi kapatınca sonraki render'da `false` olur.

## Sözleşme

- `usePrefersReducedMotion.ts` içinden named export `usePrefersReducedMotion(): boolean`.
