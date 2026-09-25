## Durum
Favori kaydı ağdan onay beklerken düğme sessiz kalıyor. Detay route'u da ilk paketle geliyor.

## Dosya sözleşmesi
`src/features/favorites/components/OptimisticFavoriteButton.tsx` içinden adlı `OptimisticFavoriteButton` export et. Props: `initialFavorite: boolean`, `onSave: (next: boolean) => Promise<void>`. Kullanıcı tıklayınca `useOptimistic` ile `aria-pressed` hemen değişsin; başarıda temel state güncellensin, hata olursa geri dönsün. Aynı istek sürerken ikinci tıklamayı engelle.

`src/router.tsx` içindeki film detay route'unu React Router 8 data route `lazy` ile böl. Route eşlemesi (`path`) statik kalsın. `vite.config.ts` içinde React Compiler'ın kararlı Babel yolunu `reactCompilerPreset()` ve `@rolldown/plugin-babel` ile etkinleştir. Gerekli paketler koordinatör tarafından checkpoint'e eklenecek; bu görev sırasında kök bağımlılıkları değiştirme.

## Kabul ölçüleri
- Düğme tıklanınca `onSave(true)` çağrılır ve beklerken `aria-pressed="true"` olur.
- Başarısızlıkta `aria-pressed="false"` geri gelir.
- Detay route'u `lazy` ile yüklenir; ana sayfa ilk paketine zorunlu girmez.
- Compiler kuralları ihlal edilmez; gerçek build ve Profiler karşılaştırması checkpoint entegrasyonunda yapılır.
