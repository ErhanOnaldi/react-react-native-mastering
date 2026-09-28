---
title: "Ölç, düzelt, yeniden ölç"
minutes: 7
kind: practice
---

# Ölç, düzelt, yeniden ölç

:::pain[Problem]
Arama ekranında hem pahalı filtre tekrarlanıyor hem de yüzlerce satır DOM'da duruyor. Bir optimizasyon bu iki sayıyı birden düşürmez.
:::

## Önce doğru sonucu koru

Bu pekiştirmede bir görev hesaplama tekrarını, diğeri büyük listenin DOM boyutunu ele alıyor. Her değişiklikten önce hangi sayacı düşürmeye çalıştığını yaz; sonra aynı veri ve eylemle yeniden ölç.

:::model[Render tetikleyicileri ve memo sınırları]
State, props veya tüketilen context değişimi render'ı tetikleyebilir; memoization yalnızca girdiler aynı kaldığında işi atlar. Pahalı filtreyi ilgisiz sayaç state'inden ayır, ama doğru sorgu değiştiğinde hesabın yenilenmesine izin ver.

:::

![Render nedenlerini ve memo sınırlarını gösteren akış](diagram:render-nedenleri)

## İki gözlem, iki ayrı sonuç

| Gözlem | Sorusu | Beklenen yön |
|---|---|---|
| vi.fn çağrı sayısı | Sayaç değişince filtre yeniden çalıştı mı? | Artmamalı |
| Gerçek listitem sayısı | Ekran dışındaki satırlar DOM'da mı? | Görünen pencereye yakın olmalı |

Önce filtrelenen verinin güncel kaldığını doğrula. Sonra sorgu değiştirip son eşleşmenin ekrana geldiğini izle. Büyük listedeyse sorgu boşken yüzlerce satır yerine yalnız görünür pencereye yakın satırları görmeyi bekle. Tek sonuçta da eski satırlar kalmamalı.

## Çalışma sırası

1. Başlangıçtaki hesaplama çağrılarını ve DOM satırlarını not et.
2. Sayaç gibi ilgisiz state'i değiştir; pahalı hesabın tekrar edip etmediğini karşılaştır.
3. Arama sorgusunu değiştir; hem inputun güncel kaldığını hem sonucun doğru olduğunu kontrol et.
4. Listeyi filtrelenmiş dizi üzerinden pencerele.
5. Tek sonuç ve boş sonuç durumlarını da gözle.

:::mistake
**Belirti:** çağrı sayısı azalır ama arama sonucu eskir. **Neden:** sorgu hesaplamanın girdilerinden çıkarılmıştır. **Düzeltme:** tüm gerçek girdileri bağımlılığa kat; yalnız ilgisiz state'i dışarıda bırak.
:::

:::mistake
**Belirti:** sanal listede arama sonrası yanlış başlıklar görünür. **Neden:** satır indeksi eski dizideki konuma bağlanmıştır. **Düzeltme:** sanal pencerenin sayısını, anahtarını ve içeriğini aynı filtrelenmiş diziden üret.
:::

:::sector
Performans incelemesinde ekipler tek seferde tek darboğaza müdahale eder. Render süresi ortamdan etkilenebilir; çağrı ve DOM sayısı gibi iş miktarını gösteren ölçüler tekrar edilebilir karşılaştırma sağlar.
:::

## Özet

- Önce belirtiyi ve ölçüyü kaydet.
- Hesaplama tekrarı ile DOM boyutunu ayrı incele.
- Filtre güncelliğini koru.
- Sanal satırları filtrelenmiş veriye bağla.
