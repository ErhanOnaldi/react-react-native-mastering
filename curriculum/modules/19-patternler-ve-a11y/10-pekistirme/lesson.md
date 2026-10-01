---
title: "A11y akışını birleştir"
minutes: 6
kind: practice
---

# A11y akışını birleştir

Bu pekiştirmede fragman dialogunun klavye akışını ve film verisine göre değişen sekmeleri birleştiriyorsun.

:::model[Render → commit → effect]
React önce DOM'u günceller, sonra effect çalışır. Bir öğe kaldırılınca focus kaybolabilir; dialog kapanınca focus'un nereye döneceğini ve sekme kaldırılınca odağın nerede kalacağını da düşün.
:::

## Dialog içinde kal, sonra geri dön

**Event bubbling**, olayın tıklanan öğeden üst öğelere yayılmasıdır. Arka planın click handler'ı başlık tıklamasını da duyabilir. `target` tıklanan öğe, `currentTarget` handler'ın bağlı olduğu öğedir: ikisi aynıysa click arka planın kendisindedir ve dialog kapanabilir.

**Focus trap**, Tab ve Shift+Tab odağının dialog dışına çıkmasını engelleyen döngüdür. Klavyeyle tetikleyiciye gel, Enter ile aç, iki yönde dolaş ve Escape ile kapat.

| Eylem | Beklenen sonuç |
| --- | --- |
| Fragman düğmesine Enter | Dialog açılır, başlangıç kontrolü focus alır |
| Son kontrolde Tab | Focus ilk kontrole döner |
| Dialog başlığında click | Dialog açık kalır |
| Boş arka planda click veya Escape | Dialog kapanır, focus tetikleyiciye döner |

Başlık tıklamasının da dialogu kapatması gerçek bir tuzaktır: bubbling yüzünden handler onu duymuştur. `target` ile `currentTarget`'ı karşılaştır; yalnız arka planın kendisi tıklanınca kapat.

## Sekme listesini film verisiyle eşleştir

Video yoksa Videolar sekmesi olmamalı; seçili panel de görünen sekmelerden biri olmalı. Veri sonradan boşalırsa seçimi geçerli sekmeye getir ve focus'u kaldırılan düğmede bırakma.

:::model[Context yayılımı]
Compound component ailesinin kökü tek seçimi tutar; Trigger ve Panel aynı Context değerini okur. Sekme sayısı film verisiyle değişse de görünür liste, seçim ve panel birbiriyle uyuşmalı.
:::

Önce modalı klavyeyle dolaş, sonra içeri ve arka plana ayrı ayrı tıkla. Sekmelerde videosu olmayan filmi ve video listesi sonradan boşalan durumu düşün. Her seferinde ekrandaki panelin yanında focus'un nerede olduğunu da kontrol et.

## Özet

- Event bubbling iç tıklamaları dış handler'a ulaştırabilir; `target` ve `currentTarget`'ı ayır.
- Modal kapanırken focus tetikleyiciye dönmeli; Tab sınırları iki yönde çalışmalı.
- Sekme, seçim ve panel mevcut film verisiyle eşleşmeli.

**Yeni terimler**

- **Event bubbling:** Olayın tıklanan öğeden üst öğelere yayılması.
- **Focus trap:** Tab odağının modal dışına çıkmasını engelleyen döngü.
- **`target` / `currentTarget`:** Tıklanan öğe / handler'ın bağlı olduğu öğe.

**Kendini yokla:** Videolar kaldırılırsa neyi birlikte kontrol edersin?

*Cevap:* Görünen sekmeleri, seçimi, paneli ve focus'un geçerli bir yerde kalmasını.
