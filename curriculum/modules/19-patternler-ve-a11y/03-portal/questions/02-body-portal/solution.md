## Neden böyle?
Portal DOM yerini değiştirir ama React Context ve React event akışı korunur. CSS kırpılmasına çözüm olur; Escape, focus ve dialog semantiğini otomatik eklemez. Bir sonraki compound Modal.Content bu portalı davranışla birleştirecek.

### Alternatif ve sınır
Özel bir `#modal-root` da hedef olabilir; hedefin gerçekten varlığını kontrol etmek gerekir.

### Sık hata
Portalı body’ye taşımak dialog rolü veya focus trap eklemez.

### Sektörde ve sıradaki adım
Tooltip ve popover primitive’leri de aynı tekniği kullanır; proje Modal.Content içinde portalı erişilebilir davranışla birleştireceksin.
