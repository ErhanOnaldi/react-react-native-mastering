Yapılandırılmış testlerle puan etiketinin iki temel sonucunu güvenceye al: tam sayı puanının biçimi ve henüz oy verilmemiş filmin etiketi.

## Gereksinimler

- Tam sayı puanında bir ondalık basamak görünmeli.
- Sıfır puan, puan verilmemiş anlamına gelmeli.
- Her senaryonun testi Arrange → Act → Assert sırasını izlemeli ve Türkçe davranış adı taşımalı.

## Örnek

| Girdi | Beklenen sonuç |
| --- | --- |
| 8 | 8.0 |
| 0 | Henüz oy yok |

## Sözleşme

- Yazılacak dosya: formatVote.test.ts
- Test edilecek modül: @impl/formatVote
- Fonksiyon: formatVote(voteAverage: number): string
