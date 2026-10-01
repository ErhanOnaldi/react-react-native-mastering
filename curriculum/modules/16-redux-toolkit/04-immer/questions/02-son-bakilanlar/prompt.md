Bir kayıt yeniden açıldığında geçmiş listenin en üstüne çıkmalı; yinelenen kayıtlar ve çok eski girdiler kaldırılmalı.

## Gereksinimler

- İşlenen kimlik listenin başında yer alır.
- Aynı kimliğin önceki kopyası kaldırılır.
- En fazla beş kimlik saklanır.
- Önceki state değişmeden kalır.

## Örnek

`[550, 603, 155]` üzerinde `603` işlenince `[603, 550, 155]`; altı farklı kayıt işlendiğinde yalnız en yeni beşi kalır.

## Sözleşme

- Dosya: `recent.ts`
- Export: `recentSlice`, `viewed(id: number)`
- State biçimi: `{ ids: number[] }`
