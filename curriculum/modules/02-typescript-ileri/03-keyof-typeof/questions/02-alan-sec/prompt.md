Bir görünüm yardımcısı seçilen nesne alanının değerini vermeli ve alanın gerçek tipini korumalı. Film ve tür nesnelerinde kullanılabilsin.

## Gereksinimler

- Yalnızca nesnede bulunan bir anahtar seçilebilmeli.
- Sonuç seçilen alanın tipi olmalı; string, sayı veya dizi bilgisi kaybolmamalı.
- Film ve başka nesne şekilleriyle çalışmalı.

## Örnek

`{ title: 'Kıyı', year: 2020 }` nesnesinden `title` seçimi `"Kıyı"`, `year` seçimi `2020` verir.

## Sözleşme

- Dosya: `task.ts`
- Export fonksiyon: `getField<T, K extends keyof T>(value: T, key: K): T[K]`.
