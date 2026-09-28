Film detay bileşeninde tekrar eden bekleme dalları var. İçeriği hazır olana kadar dışarıdaki bekleme alanını kullanacak bir detay görünümü oluştur.

## Gereksinimler

- Film verisi `load(id)` ile alınsın ve cache’te id’ye göre ayrı saklansın.
- Başarılı durumda film başlığı `<h1>` içinde görünsün.
- Veri gelene kadar bileşen ağacının dışındaki Suspense fallback’i kullanılmalı; içeride ayrıca loading dalı olmasın.
- Hata, bileşen dışındaki hata sınırı tarafından gösterilebilsin.

## Örnek

550 için `load` `{ id: 550, title: 'Dövüş Kulübü' }` döndürür; ekranda aynı başlığa sahip bir `<h1>` görünür.

## Sözleşme

- `MovieDetail.tsx` dosyasından `MovieDetail({ id, load })` named export et.
- `load(id: number): Promise<{ id: number; title: string }>`.
- Cache key’i `['movie', id]`.
