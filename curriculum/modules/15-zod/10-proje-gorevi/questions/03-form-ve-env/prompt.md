Sinema'nın liste ve yorum formlarını, ayrıca uygulama ayarlarını tek ve tutarlı veri kurallarıyla çalıştır.

## Gereksinimler
- Liste adı trim sonrası boş olmasın; açıklama string, görünürlük boolean, etiketler { value: string } öğelerinden oluşsun.
- Yorum metni trim sonrası boş olmasın ve Yorum gerekli mesajı gösterilsin; rating 1–5 aralığında olsun.
- Boş liste adı Ad gerekli mesajını göstermeli; geçersiz form gönderilmemeli.
- Watchlist kayıt tipindeki id ve createdAt yalnızca kayıt sonrası eklenir.
- Env tokenı trimlenip boşsa VITE_TMDB_TOKEN adını içeren hata versin; opsiyonel boş başlık Sinema olsun.
- TMDB Bearer başlığı env'den okunan tokenı kullansın.
- Form input ve submit değerleri dönüşüm olduğunda doğru biçimde tiplensin.
- Etiket ekleme/silme, yıldız seçimi, label ve hata akışı ile mevcut gönderim davranışı korunsun.

## Örnek
Liste adı "  Klasikler  " olarak girilince kayıt adı Klasikler olur. Boş yorum gönderilmez ve /comments/add isteği atılmaz.

## Sözleşme
- src/features/watchlists/schemas.ts dosyasında watchlistSchema ve reviewSchema named export'larını oluştur.
- src/features/watchlists/WatchlistForm.tsx içindeki WatchlistForm ve src/features/watchlists/ReviewForm.tsx içindeki ReviewForm bileşenlerini güncelle.
- src/shared/config/env.ts dosyasında env named export'unu oluştur.
- WatchlistForm'da Liste adı alanı ve Kaydet düğmesi; ReviewForm'da Yorum alanı, 1 yıldız–5 yıldız arası erişilebilir seçim düğmeleri ve Gönder düğmesi bulunmalı.
- Alan hataları role=alert ile bulunabilir olmalı.

## Kısıtlar
- Aynı alan kuralı form davranışında iki ayrı yerde çelişkili biçimde tanımlanmamalı.
