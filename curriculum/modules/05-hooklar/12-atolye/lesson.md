---
title: "State ve asenkron belirtileri"
minutes: 6
kind: practice
---

# State ve asenkron belirtileri

:::pain[Problem]
Film değişiyor ama özet eski filmde kalıyor. Tür sayacı seçimle eşleşmiyor. Yavaş arama cevabı yeni sonucu siliyor. Detay sayfası yeni id'yi aldığı halde eski başlığı gösteriyor.
:::

Atölye görevlerinde başlangıç kodu çalışır ama güvenilmezdir. Önce belirtinin nasıl üretildiğini önizlemede gör; sonra testin hangi davranışı kilitlediğini oku. Bu aşamada hangi aracı seçeceğini giderek daha az söyleyen görevler görmen normal.

## Belirtiyi sınıflandır

| Görev | Soru |
| --- | --- |
| Bayat özet | Bu bilgi state mi, seçili filmden türeyen değer mi? |
| Tür sayacı | Sayaç ayrı kaynak mı, seçili id dizisinin uzunluğu mu? |
| Eski arama | Eski asenkron işin ekrana yazma hakkı var mı? |
| Detay değişmiyor | Effect hangi kimliğe bağlı çalışmalı? |

:::model[State snapshot]
Bir render'da oluşturulan callback o render'ın değerlerini görür. Atölyedeki bayat değerlerin bir kısmı bu yüzden ortaya çıkar: eski render'dan kalan iş, yeni ekrana veri yazmaya çalışır.
:::

:::model[Ağaç ve kimlik]
Yerel state'in ne zaman korunup ne zaman sıfırlanacağını anlamak için component kimliğini düşün. Bu atölyede her sorunu key ile çözmeyeceksin; ama "state kime ait?" sorusu hep yanında olacak.
:::

## Çalışma önerisi

1. Önizlemede hatayı üret.
2. Test adlarını oku; her test bir gereksinim cümlesidir.
3. Önce en küçük davranışı düzelt.
4. Sonra hızlı geçiş veya temizleme gibi ikinci testleri çalıştır.

:::mistake[Sık hata]
Belirti → İlk test geçiyor, ikinci test hızlı geçişte kalıyor. Neden → Çözüm yalnız mutlu yolu düzeltti; eski render/istek hâlâ etkili. Düzeltme → Temizleme, türetme veya dependency sınırını da kontrol et.
:::

:::sector
Gerçek bakım işinde çoğu bilet böyle gelir: "eski sonuç geri geliyor", "sayaç yanlış", "alan temizlenmiyor". Çözüm aracı kadar, belirtiden kök nedeni ayırma alışkanlığı değerlidir.
:::

## Özet

- Belirtiyi önce üret, sonra düzelt.
- Türetilmiş değerleri state'e kopyalama.
- Eski asenkron işlerin yazma hakkını kaldır.
- Effect'in bağlı olduğu kimliği açık yaz.

Kendini yokla: Bir sayı her zaman seçili dizi uzunluğuna eşitse ayrı state olmalı mı?  
Cevap: Hayır. Dizi uzunluğundan render sırasında türetilebilir.
