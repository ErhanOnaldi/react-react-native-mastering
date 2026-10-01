Sinema'da farklı listelerin son filmini veya son türünü alman gerekiyor. Tek bir yardımcı fonksiyon, verdiğin listedeki son öğeyi dönsün; liste boşsa sonuç `undefined` olsun.

## Gereksinimler

- Dışa aktarılan `lastItem` fonksiyonu verilen dizinin son öğesini döndürmeli.
- Boş dizi verildiğinde `undefined` döndürmeli.
- Dönüş tipi, dizi öğelerinin tipini korumalı. Örneğin film verildiğinde sonuç `Movie | undefined` olmalı; `any` olmamalı.

## Örnek

`[{ id: 550, title: 'Dövüş Kulübü' }, { id: 603, title: 'Matrix' }]` verildiğinde sonuç `{ id: 603, title: 'Matrix' }` olur. Boş dizi verildiğinde sonuç `undefined` olur.

## Sözleşme

- Dosya: `task.ts`
- Dışa aktarılan fonksiyon: `lastItem`
- Film öğesi: `{ id: number; title: string }`
