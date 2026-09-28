Sinema bilet kasasında çoklu bilet alımlarında indirimli toplam tutarın yanlış hesaplandığı tespit edildi. Önizleme ekranındaki belirtiyi inceleyerek ve testleri referans alarak fiyatlandırma fonksiyonundaki hatayı düzelt.

## Gereksinimler

- Bilet sayısı (`ticketCount`) veya birim fiyat (`pricePerTicket`) 0 veya daha küçükse toplam tutar `0` olmalıdır.
- İndirimsiz durumda (`discountPercent === 0`) toplam tutar tam olarak `ticketCount * pricePerTicket` olmalıdır.
- Belirlenen indirim yüzdesi, tek bir bilete değil **satın alınan tüm biletlerin toplam tutarına** uygulanmalıdır.
- Yüzde 100 indirim uygulandığında toplam tutar `0` olmalıdır.

## Örnek

Önizleme sekmesinde bilet sayısını **2**, indirim oranını **%20** seçin:
- Birim fiyat: `100 ₺`
- Beklenen Tutar: `(2 × 100 ₺) - %20 = 160 ₺`
- Önizlemedeki Hatalı Belirti: Ekranda `180 ₺` yazmaktadır (indirim sadece 1 bilet için düşülmüştür).

## Sözleşme

- Dosya ve export: `ticketPricing.ts` → `export function calculateBookingTotal(ticketCount: number, pricePerTicket: number, discountPercent?: number): number`
