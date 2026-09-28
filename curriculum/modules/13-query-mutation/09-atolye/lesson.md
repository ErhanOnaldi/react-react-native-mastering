---
title: "Cache belirtilerini ayıkla"
minutes: 6
kind: practice
---

# Cache belirtilerini ayıkla

:::pain[Problem]
Komedi seçili ama aksiyon filmleri duruyor. Bir puan gönderilemediği halde ekranda kalıyor; başarılı puanlamadan sonra da “Puanladıklarım” eski görünüyor.
:::

## Belirtiyi takip et, verinin sahibini bul

Atölyede iki çalışan ekranı teşhis edip düzeltirsin. Her görev, kullanıcı davranışıyla başlayıp görünür sonuca gider. Önce belirtiyi tekrar et; hangi seçim veya mutation’dan sonra yanlış UI çıktığını not et. Sonra query key, istek parametresi ve ekranda gösterilen verinin aynı seçimi temsil edip etmediğini araştır.

:::model[Query cache ve mutation]
Query key sunucu okumasının kimliğidir; POST/DELETE bu cache’i kendiliğinden güncellemez. Tür seçimi farklı sonuç veriyorsa seçimin query kimliğine ve istek girdisine yansımasını ara. Yazma sonrası yanlış değer görünüyorsa optimistic değişikliğin başarısızlıkta geri alınıp alınmadığını ve başarılı işlemden sonra listenin yenilenip yenilenmediğini izle.
:::

## Kendi teşhis sıran

1. Ekranda hangi kontrolün değiştiğini ve hangi içeriğin aynı kaldığını yaz.
2. Network’te yeni istek var mı, varsa URL parametresi değişmiş mi bak.
3. Aynı query key’in farklı filtreleri ayırıp ayırmadığını incele.
4. Başarısız yazmada geçici görünümün nerede tutulduğunu bul.
5. Çözümden sonra hem başarılı hem başarısız yolu tekrar et.

İlk görevde tür seçimi ile film listesi arasındaki kopukluk görünür. İkinci görevde hem yıldız değeri hem rated listesi önemlidir. Kullanıcı aynı anda iki alanı izlediği için yalnız düğmenin metninin değişmesi yeterli olmaz.

Bu atölyede belirtiler çözümün nedenini söylemez. İpuçları da önce nereye bakacağını, sonra kullanabileceğin aracı açar. Önce kendi hipotezini kurup küçük bir değişiklikle doğrula; hata mesajını görmezden gelerek state’i başka yere kopyalama.

:::sector
Ürün hata ayıklamasında ekranda doğru görünen tek bir metin bütün akışın doğru olduğunu kanıtlamaz. Ekipler kullanıcı adımını, gönderilen isteği ve sonraki okumanın sonucunu birlikte izler. Bu yaklaşım stale cache, yanlış key ve geri alınmayan optimistic değerleri birbirinden ayırır.
:::

## Özet

- Önce kullanıcı belirtisini tekrar et, sonra ağ ve cache kimliğini izle.
- Filtre seçimi hem sorgu kimliğini hem sunucu isteğini temsil etmeli.
- Başarısız mutation geçici görünümü geri almalı.
- Başarılı mutation sonrası ilgili okuma sunucuyla uzlaşmalı.

**Kendini yokla:** Tür dropdown’ı değiştiği halde liste aynıysa ilk neyi karşılaştırırsın?  
Cevap: Seçilen türün query key’e ve istek parametresine ulaşıp ulaşmadığını.
