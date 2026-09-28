Dışa aktarma işlemi kendisine verilen kayıt kimliklerinin bağımsız bir kopyasını sonuç olarak taşımalı.

## Gereksinimler

- İşlem dispatch edilince store durumu hemen `pending` olur.
- Başarıyla tamamlandığında durum `fulfilled`, `ids` ise aynı değerleri taşıyan yeni bir dizi olur.
- Girdi dizisi değişmeden kalır; sonuç dizisi aynı referans değildir.
- Lifecycle state geçişleri hazır reducer’da bulunur.

## Örnek

Girdi `[550, 603]` → sonuç `[550, 603]`; iki dizi içerikçe eşit, referansça farklıdır.

## Sözleşme

- Dosya: `exportList.ts`
- Export: `exportList(ids: number[])`, `exportSlice`
- Son state biçimi: `{ status: "idle" | "pending" | "fulfilled" | "rejected"; ids: number[] }`

## Kısıtlar

- Bu işlem için dış ağ isteği gerekmez.
