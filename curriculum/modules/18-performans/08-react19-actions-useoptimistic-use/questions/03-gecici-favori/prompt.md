## Durum
Favori isteği beklerken kalp değişmiyor. Kullanıcı düğmenin çalışmadığını sanıyor.

## Yap
- `useOptimistic` ile tıklamada hemen geçici favori görünümü üret.
- `save(next)` başarılıysa temel state'i güncelle.
- Hata gelirse geçici görünüm temel state'e dönsün.
- Düğmede `aria-pressed` gerçek görünen durumu anlatsın.

Bu örnek gerçek async kaydı `save` prop'undan alır; test hem başarıyı hem hatayı dener.
