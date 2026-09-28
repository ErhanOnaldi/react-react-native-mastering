Önizlemede ilk film `Dövüş Kulübü`. `Başlangıç` düğmesine basınca seçim değişiyor, fakat özet hâlâ ilk filmin süresini ve başlığını anlatıyor. `MovieSummary` seçili film değiştiği anda doğru özeti göstermeli.

## Gereksinimler

- İlk durumda özet `Dövüş Kulübü: 139 dakika` olur.
- `Başlangıç` seçilince özet `Başlangıç: 148 dakika` olur.
- Seçili filmin düğmesi `aria-pressed="true"` taşır.
- Önceki filme dönünce özet tekrar onun başlığı ve süresiyle eşleşir.

## Örnek

`Başlangıç` düğmesine bas → özet `Başlangıç: 148 dakika`; sonra `Dövüş Kulübü` düğmesine bas → özet `Dövüş Kulübü: 139 dakika`.

## Sözleşme

- Dosya ve export: `MovieSummary.tsx` → `MovieSummary`
- Testler özeti `aria-label="Film özeti"` üzerinden okur.
- Testler film düğmelerini adlarıyla bulur.
