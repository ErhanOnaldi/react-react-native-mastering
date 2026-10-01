---
title: "Arama akışını birleştir"
minutes: 6
kind: practice
---

# Arama akışını birleştir

Burada daha önce kurduğun parçaları aynı Sinema aramasında bir araya getireceksin: yazma hızına uyum sağlayan bekleme, ağ cevabını yönetme ve ekrandaki sonucu güncel tutma. İlk iki görevde aramayı hook ve ekran sınırlarından ele alırsın; son görevde arama state'inin geçişlerini tarif eden reducer'ı davranış testleriyle incelersin.

:::model[Effect yaşam döngüsü]
Effect, React dışındaki bir işi başlatır; dependency değişince önce eski çalışmanın cleanup'ı, ardından yenisi çalışır. Arama akışında timer ve ağ isteği iki ayrı dış iştir. Her birinin cleanup'ının neyi durdurduğunu ayrı ayrı düşün.
:::

:::model[Race condition]
İki arama isteği farklı sırada tamamlanabilir. Yeni sorgu eski isteğin sonucundan önce dönerse, eski cevap artık ekrandaki sonucu değiştirmemeli; son geçerli sorgu kazanmalı.
:::

## Parçaları sırayla düşün

| Parça | Hangi değişime bakar? | Ne olmalı? |
| --- | --- | --- |
| Yazma beklemesi | Kullanıcının sorgusu değişir | Hızlı yazarken bekleyen eski timer temizlenir |
| Ağ isteği | Beklemesi tamamlanmış sorgu değişir | Gereksiz veya eski isteğin sonucu güncel listeyi ezmez |
| Ekran | Kullanıcının input'u ve arama durumu değişir | Input boşalınca eski sonuç görünmez |
| Reducer | Bir arama olayı gelir | Yeni state'te eski hata ve sonuçlar gereken yerde temizlenir |

Bu ayrım sorunu küçültür: timer'ın görevi yazma hızını yönetmek, ağ isteğinin görevi cevap almak, reducer'ın görevi ise verilen olaydan yeni state'i hesaplamaktır. Reducer saf fonksiyondur; yani aynı state ve action ile dış dünyaya dokunmadan aynı yeni state'i üretir.

## Akışı çalışırken izle

Kullanıcı `M` yazıp hemen `Matrix` olarak değiştirsin. Bekleme süresi bitmeden sorgu yenilendiği için `M` için bekleyen timer temizlenir. `Matrix` araması başladıktan sonra input boşalırsa, ekranda önceki `Matrix` sonucu bırakılmaz.

| An | Sorgu | Timer / ağ | Kullanıcıya ait güncel sonuç |
| --- | --- | --- | --- |
| 1 | `M` | `M` timer'ı bekliyor | Henüz sonuç yok |
| 2 | `Matrix` | `M` timer'ı temizlenir, `Matrix` timer'ı başlar | Henüz sonuç yok |
| 3 | `Matrix` | Süre dolunca `Matrix` isteği başlar | Son sorgunun cevabı bekleniyor |
| 4 | boş | Bekleyen eski iş artık sonucu güncellememeli | Eski `Matrix` listesi görünmez |

Buradaki önemli nokta, her değişikliğin hangi işi geçersiz kıldığını ayırmaktır. Yalnızca input'u geciktirmek, ağdan geç dönen eski cevabın yazmasını tek başına engellemez; cleanup ve güncel sorgu kontrolü de kendi sorumluluğunu taşır.

:::mistake[Eski listenin input temizlenince kalması]
Belirti → Arama alanı boş olduğu halde önceki filmler görünür. Neden → Boş sorgu yeni bir istek başlatmıyor ama eski sonuç state'i de temizlenmiyor. Düzeltme → Boş sorgu durumunu açıkça ele al; güncel ekranda eski sonuç bırakma.
:::

## Nasıl çalışmalı?

Önce sorgu, istek durumu, sonuç ve hata arasındaki ilişkiyi oku. Ardından timer ile ağ isteğini ayrı sorumluluklar olarak düşün; en son aynı state geçişlerinin hangi alanları koruyup hangilerini temizlemesi gerektiğini kontrol et. Bir ekran doğru görünse bile state'in tamamındaki eski değerleri fark et; örneğin yeni başarı eski hata mesajını taşımamalı.

:::sector
Kullanıcı hızlı yazdığında zamanlama hataları görünür olur. Timer ve istek yaşam döngülerini ayrı tutmak, hem her cleanup'ın görevini anlaşılır kılar hem de yeni bir ekranın aynı davranışı kullanmasını kolaylaştırır.
:::

## Özet

- Timer ve ağ isteği farklı dış işlerdir; cleanup'larını ayrı düşün.
- Input temizlendiğinde eski sonuç güncel ekranda kalmamalı.
- Asenkron cevapların geliş sırası, sorguların başlama sırasından farklı olabilir.
- Reducer, state geçişini dış sisteme dokunmadan hesaplar.

**Yeni terimler**

- `Reducer`: Gelen state ve action'dan yeni state üreten saf fonksiyon.
- `Race condition`: İşlerin tamamlanma sırası değiştiğinde yanlış sonucun kazanabilmesi.

**Kendini yokla:** `M` isteği `Matrix` isteğinden sonra dönerse ekrandaki listeyi hangisi belirlemeli?

**Cevap:** Kullanıcının son sorgusu olan `Matrix`; eski `M` cevabının ekrana yazma hakkı olmamalı.
