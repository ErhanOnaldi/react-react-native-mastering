Film detay görünümünde bekleme ve hata halleri dışarıdaki sayfa kabuğuna ait olsun. Film hazır değilken yükleme alanı, istek başarısızsa anlaşılır hata mesajı gösteren bileşeni oluştur.

## Gereksinimler

- `load(id)` sonucu id’ye göre ayrı cache’te tutulsun.
- Başarılı durumda film başlığı `<h1>` içinde görünsün.
- Veri beklenirken `Film yükleniyor…` metni görünsün.
- İstek hata verirse `role="alert"` içinde `Film yüklenemedi` metni görünsün.
- Bekleme ve hata arayüzleri film içeriğinin çevresinde kurulsun; içeriğin kendisinde durum dalları olmasın.

## Örnek

550 için `load` `{ id: 550, title: 'Dövüş Kulübü' }` döndürür; ekranda aynı başlıklı `<h1>` görünür. İstek reddedilirse `Film yüklenemedi` görünür.

## Sözleşme

- `MovieDetail.tsx` dosyasından `MovieDetail({ id, load })` named export et.
- `load(id: number): Promise<{ id: number; title: string }>`.
- Cache key’i `['movie', id]`.
