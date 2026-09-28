Uzun bir parça adı aynı satırdaki süresini aşağı itiyor. İkisini tek satırda tut; metin gerektiğinde daralsın, kısa süre değeri yerini korusun.

## Gereksinimler
- Başlık ve süre aynı satırın çocukları olsun.
- Satır `flex items-center justify-between gap-2` class'larını taşısın.
- Başlık `min-w-0 truncate`; puan `shrink-0` class'larını taşısın.

## Örnek
`Senfoninin uzun kayıt adı` ve `04:32` verildiğinde süre satırın sağında kalır.

## Sözleşme
- Dosya ve export: `MovieRow.tsx` → `MovieRow({ title, score })` bileşeni.
- Başlık bir heading, puan/süre ayrı bir metin öğesi olarak görünür.
- Önizlemede uzun bir başlıkla düzeni kontrol et.
