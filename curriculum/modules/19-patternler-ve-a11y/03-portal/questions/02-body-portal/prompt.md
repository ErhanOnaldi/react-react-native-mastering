Film kartının `overflow: hidden` sınırı modalın altını kesiyor. Çocuk içeriği kartın dışında görünürken tıklanabilir kalmalı.

## Gereksinimler

- Verilen çocukları `document.body` altında render et.
- Çocukları adı **Fragman alanı** olan tek bir `region` içinde tut.
- Kartın içinde `region` kalmasın.
- İçerideki button click handler'ı çalışmaya devam etsin.

## Örnek

Kart içinde `<button>Oynat</button>` verildiğinde erişilebilirlik ağacında tek `Fragman alanı` region'ı ve onun içinde `Oynat` düğmesi bulunur. Bölge DOM'da `document.body` öğesinin doğrudan çocuğudur.

## Sözleşme

- `BodyPortal.tsx` içinden named export `BodyPortal({ children })`.
- `children` türü `ReactNode`; içerik `region` rolü ve `Fragman alanı` adıyla gruplanır.
