## Durum
Oyuncu paneli büyük; ana sayfayı açan kullanıcı bu kodu henüz istemiyor.

## Yap
- `CastPanel.tsx` dosyasını `React.lazy` ile dinamik import et.
- `Suspense` yüklenirken `Oyuncular yükleniyor` fallback metnini göster.
- Başlık hemen görünsün; panel sonra gelsin.

`CastPanel.tsx` salt okunur. `lazy` tanımını bileşenin dışına koy.
