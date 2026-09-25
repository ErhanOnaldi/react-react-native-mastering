---
title: "Ölç, düzelt, yeniden ölç"
minutes: 9
kind: practice
---

# Ölç, düzelt, yeniden ölç

:::pain[Problem]
Arama listesinde hem gereksiz hesaplama hem de fazla DOM satırı kaldı. Tek bir optimizasyon her iki sayacı da düzeltmez.
:::

## Birleşik çalışma
Önce `vi.fn` ile pahalı sıralamayı say. Sonra sorgu değişince yeniden çalışmasına izin ver, ilgisiz sayaç değişince engelle. Ayrı görevde sanallaştırılmış listeye filtre uygula ve DOM satırı sayısını karşılaştır.

Doğruluk önceliklidir: az hesaplama için eski sonuç göstermemelisin. Sıralama ve filtreyi türetilmiş veri olarak düşün; ayrı state kopyası tutma.

:::tip
İyi performans testi milisaniye eşiği değil, iş miktarı ölçer.
:::

## Üç sayaçla karar ver

| Sayaç | Hangi soruyu cevaplar? |
|---|---|
| Profiler commit sayısı | Aynı eylem kaç kez listeyi commit etti? |
| `vi.fn(filter)` çağrı sayısı | İlgisiz state pahalı hesabı tekrarladı mı? |
| DOM `listitem` sayısı | Ekran görünmeyen yüzlerce satırı da taşıyor mu? |

İlk görev hesaplamayı, ikinci görev DOM boyutunu hedefler. Birinci test yeşilken ikinci hâlâ kırmızı olabilir; bu normaldir. Gözlem → tek değişiklik → yeniden gözlem sırasını koru. Yeni bir film geldiğinde listenin doğru güncellendiğini de doğrula; yalnız sayıları düşüren ama eski sonuç gösteren optimizasyon başarısızdır.
