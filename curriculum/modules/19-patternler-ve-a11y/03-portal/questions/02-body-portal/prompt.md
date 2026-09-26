Film kartı `overflow: hidden` kullanıyor; modalın altı kesiliyor. React ilişkisini koruyup DOM düğümünü `document.body` altına taşı.

## Gereksinimler
- `BodyPortal({ children })` çocukları `createPortal` ile body altında render etsin.
- İçeriği tek bir **Fragman alanı** adlı `region` içinde tut; arka kartın içinde hiçbir region kalmasın.
- Portal içindeki düğmenin click handler'ı çalışsın.

Önizlemede kartın çerçevesini ve taşan alanı gözle.
