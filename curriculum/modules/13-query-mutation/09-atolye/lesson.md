---
title: "Cache belirtilerini ayıkla"
minutes: 8
kind: practice
---

# Cache belirtilerini ayıkla

Atölyede iki Sinema ekranındaki belirtiyi inceleyip düzeltirsin: bir seçim değiştiği halde filmler değişmiyor; başarısız puan yazması da eski değeri geri getirmiyor. Her seferinde kullanıcı adımını tekrar et, hangi verinin değişmesi gerektiğini bul ve ekrandaki sonucu istekle karşılaştır.

:::model[Query cache ve mutation]
Query sunucudan okunan veriyi cache’te tutar; **query key**, bu cevabın cache’teki kimliğidir. Mutation sunucuya yazma yapar ama query cache’ini otomatik değiştirmez. Seçim değişince doğru query key ve istek girdisini; yazma başarısız olunca rollback’i (önceki cache değerini geri yüklemeyi); başarıdan sonra da ilgili listenin invalidate edilmesini (yeniden kontrol edilmesi için işaretlenmesini) izle.
:::

## Belirtiden sorguya doğru ilerle

İlk örnek: Keşif ekranında yıl filtresini 2020’den 2024’e aldın, ama aynı filmler duruyor. Kontrolün değeri değişti; şimdi bu yıl değerinin hem cache’teki query kimliğine hem sunucu isteğine ulaşıp ulaşmadığını kontrol et. Query key değişmezse Query önceki cevabı aynı veri gibi gösterebilir.

Bir adım daha: Key değişiyor ama sonuç hâlâ eskiyse Network’te isteğin URL’sine bak. Cache kimliği yeni yılı anlatırken URL eski yılı taşıyorsa, ekranda yanlış sonuç gelmesinin nedeni isteğin girdisidir. İki tarafın da aynı seçimi anlatması gerekir.

Üçüncü örnek: Bir filmi izleme listene ekleme isteği beklerken satır hemen beliriyor, ancak sunucu hata verince de kalıyor. Ekrandaki geçici değişiklikle sunucunun kabul ettiği veri aynı şey değildir. Yazmadan önceki listeyi sakla; hata halinde geri yükle, başarıdan sonra ilgili okumayı sunucuyla karşılaştır.

Bu örneklerde teşhis sırası giderek genişliyor: önce kontrolün değişimini, sonra query kimliği ile isteği, en sonunda yazma ve geri alma akışını inceliyorsun. Bu sırayla ilerlemek, aynı ekrandaki birkaç olası kaynaktan birini tahmin etmek yerine kanıt bulmanı sağlar.

| An | Gözlem | Bir sonraki bakış |
| --- | --- | --- |
| t0 | Yeni filtre seçildi | Kontrol gerçekten yeni değeri mi gösteriyor? |
| t1 | Liste değişmedi | Query key seçilen filtreyi içeriyor mu? |
| t2 | Yeni istek çıktı | URL parametresi aynı filtreyi taşıyor mu? |
| t3-hata | Geçici puan kaldı | Hata yolunda eski cache geri yükleniyor mu? |
| t3-başarı | Puan listesi eski | İlgili rated query yenileniyor mu? |

Tablodaki sıra, önce ekranda gördüğün kontrolü doğrulayıp sonra veri yolunu takip eder. İstek yoksa sorun yanlış URL parametresi olmayabilir; Query aynı key için elindeki cevabı kullanıyor olabilir. İstek varsa URL, sunucuya hangi seçimin gittiğini gösterir.

## Küçük bir gerçek hatayı yakala

Belirti: Yıl filtresi 2024 yazıyor, ama Network isteğinde `year=2020` görüyorsun. Neden: Ekrandaki state güncellenmiş, fakat query fonksiyonuna eski değer bağlanmış olabilir. Düzeltme: Seçilen değerin kontrol, query key ve istek parametresi boyunca aynı kaldığını adım adım izle.

Başarısız puanlamada da “düğme hata gösterdi” demek yeterli değil. Rated listede geçici değer kaldıysa rollback eksik; başarıdan sonra liste eskiyse invalidation eksik veya yanlış query kapsamındadır. Önce hatayı yeniden üret, sonra hangi adımda beklenen verinin ayrıldığını bul.

:::model[Mutation ve invalidation]
Optimistic update sonucu erkenden gösterir; hata olursa snapshot geri yüklenir, başarılı yazmadan sonra ilgili query yeniden okunur. Atölyedeki yeni iş, bu akışı hazır örneği ezberleyerek değil ekrandaki belirtiyi Network ve cache kimliğiyle eşleştirerek bulmaktır.
:::

## İki ekranı nasıl çalışırsın?

Önce belirtiyi kendin tekrar et: hangi seçimi yaptın, ne değişti, ne aynı kaldı? Sonra query key’i ve Network’teki istek girdisini karşılaştır. Yazma akışında beklerken, hata ve başarı anlarını ayrı izle; geçici puanın nerede tutulduğunu ve listenin ne zaman yeniden okunduğunu not et. Küçük bir değişiklik yap, aynı adımları yeniden deneyip sonucu doğrula.

Bir ekranda doğru görünen tek mesaj bütün akışın doğru olduğunu kanıtlamaz. Kontrol, istek ve sonraki liste cevabı aynı kullanıcı seçimi veya puan değişikliği üzerinde uzlaşmalı.

## Özet

- Kontrol, query key ve istek aynı filtreyi anlatmalı.
- Query key cache’te hangi cevabın tutulduğunu belirler.
- Hata halinde optimistic değişiklik geri alınmalı.
- Başarılı yazmadan sonra ilgili rated liste sunucuyla uzlaştırılmalı.
- Belirtiyi tekrar et; sonra Network ve cache kapsamını sırayla incele.

**Yeni terimler**

- **Query key:** Query cevabını cache’te tanımlayan değer dizisi.
- **Rollback:** Başarısız geçici değişikliği geri alıp önceki cache değerini yükleme.
- **Invalidation:** Query’yi yeniden kontrol edilmesi gereken durumda işaretleme.

**Kendini yokla:** Filtre değişti, istek de çıktı ama sonuç yanlış. İlk olarak neyi karşılaştırırsın?

Cevap: Query key’deki filtreyle Network URL’sindeki parametrenin aynı seçimi taşıyıp taşımadığını.

**Kendini yokla:** Puan isteği hata verdi ve geçici değer hâlâ görünüyor. Hangi adımı incelemelisin?

Cevap: Başarısızlıkta eski snapshot’ın geri yüklenip yüklenmediğini.
