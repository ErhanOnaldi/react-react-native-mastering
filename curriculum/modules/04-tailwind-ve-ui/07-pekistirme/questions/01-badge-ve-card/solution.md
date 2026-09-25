## Neden böyle?

`children` composition ile içerik kullanım yerine kalır. Doğal HTML props'larını genişletmek `data-*`, `aria-*` ve event'leri tek tek yeniden tanımlamayı önler. `cn` aynı utility'nin override edilmesine izin verir; salt string birleştirme `p-4 p-8` çatışmasını çözümsüz bırakır. Gerçek projede dosyalar `badge.tsx` ve `card.tsx` olarak ayrılacak.
