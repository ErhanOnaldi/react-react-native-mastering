Uzun film başlığı aynı satırdaki puanı aşağı itiyor. İkisini tek satırda tut; başlık gerektiğinde daralsın, puan yerini korusun.

## Gereksinimler
- Başlık ve puan aynı satırın çocukları olsun.
- Satır `flex items-center justify-between gap-2` class'larını taşısın.
- Başlık `min-w-0 truncate`; puan `shrink-0` class'larını taşısın.

## Örnek
`Yıldızlararası: Uzun Bir Yolculuk` ve `8.6` verildiğinde puan satırın sağında kalır.

## Sözleşme
- Dosya ve export: `MovieRow.tsx` → `MovieRow({ title, score })` bileşeni.
- Başlık bir heading, puan ayrı bir metin öğesi olarak görünür.
- Önizlemede uzun bir başlıkla düzeni kontrol et.
