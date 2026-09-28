İzleme listesi için tam kayıt, yeni kayıt girdisi, başlık görünümü ve paylaşım bağlantısı sözleşmeleri oluştur.

## Gereksinimler
- Tam kayıtta id ve createdAt string; name boş olmayan string; isPublic boolean olmalı.
- Yeni kayıt girdisi id ve createdAt alanlarını istememeli, fakat name kuralını korumalı.
- Paylaşım bağlantısı geçerli URL olmalı.
- Başlık görünümü yalnızca name alanını doğrulayıp döndürmeli.

## Örnek
{ id: "1", createdAt: "2026-09-25", name: "Klasikler", isPublic: true } tam kayıttır. Yeni girdi yalnız name ve isPublic taşır.

## Sözleşme
- schemas.ts dosyasında watchlistSchema, newWatchlistSchema, publicWatchlistSchema ve watchlistTitleSchema named export'larını tanımla.

