Küçük bir sonuç panelinde durum geçişleri düğmelerle tetiklenecek. Ekran, tek state kaynağından `Hazır`, `Yükleniyor` veya film sayısını göstermeli.

## Gereksinimler

- İlk ekranda `Hazır` metni görünür.
- `Yükle` düğmesine basınca `Yükleniyor` metni görünür.
- `Tamamla` düğmesine basınca `3 film` metni görünür.
- Düğmeler erişilebilir adlarıyla bulunabilir olmalı.
- Görünen metin geçerli state'ten üretilmeli.

## Örnek

Başlangıç → `Hazır`; `Yükle` tıkla → `Yükleniyor`; `Tamamla` tıkla → `3 film`.

## Sözleşme

- Dosya ve export: `ResultPanel.tsx` → `ResultPanel`
- Testler `Yükle` ve `Tamamla` adlı button'ları, ayrıca durum metinlerini arar.
