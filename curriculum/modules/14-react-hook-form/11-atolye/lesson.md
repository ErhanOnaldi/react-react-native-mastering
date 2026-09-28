---
title: "Formdaki kayıp durumları teşhis et"
minutes: 6
kind: practice
---

# Formdaki kayıp durumları teşhis et

:::pain[Liste değişti, eski bilgi kaldı]
Düzenleme ekranında bir listeden diğerine geçtiğinde önceki ad alanlarda kalıyor. Başka bir denemede puan gönderimi hata alıyor ama seçim sıfırlanıyor. İki belirti de formun kayıt kaynağı ile ekrandaki değerlerin farklı zamanda güncellendiğini gösteriyor.
:::

## Belirtiyi tekrar et, sonra veriyi izle

İlk çalışmada farklı listeleri art arda seç ve her iki alanın da yeni kaydı gösterdiğini kontrol et. Ardından alanları değiştirmeden kaydet düğmesine bas; değişiklik yoksa gereksiz kayıt yapılmamalı. Bir alanı değiştirip kaydettiğinde gönderilen değer son görünür değere eşit olmalı.

İkinci çalışmada puan seç, gönder ve sunucu hatasını gözle. Hata metni kullanıcıya görünmeli, seçili puan ekranda kalmalı ve tekrar gönderim mümkün olmalı. Başarı durumunda ise eski değerleri korumak artık gerekmeyebilir.

:::model[Form deposu ve abonelik]
RHF'nin başlangıç değerleri bir kez uygulanır; yeni düzenlenen kayda geçince form deposuna yeni başlangıç değerini vermen gerekir. Ağ hatası ise reset için başarı sayılmaz: girdiyi koru. Bu atölyede aynı modelin prop değişimine ve mutation sonucuna bakan iki farklı tarafını teşhis edeceksin.
:::

## Çalışma sırası

Önce ekrandaki yanlış değeri üret, sonra prop veya cevap değiştiği anda form değerinin nerede güncellendiğini izle. Kodun yalnız görünen alanı değil, dirty ve pending davranışını da değerlendir. Sorun düzeldikten sonra ikinci kez aynı işlem yapıp düğmenin doğru etkinlik durumuna döndüğünü kontrol et.

:::sector
Üretim hata raporlarında “form bozuk” yerine tekrar adımı yazılır: hangi kayıt seçildi, ne değiştirildi, hangi cevap geldi ve hangi değer kayboldu. Bu bilgi, render ve istek zamanlamasını ayırmayı kolaylaştırır.
:::

## Özet ve kendini yokla

- Prop değişimi yeni form başlangıcı gerektirebilir.
- Hata cevabından sonra veri korunmalı; reset başarı koşuluna bağlı olmalı.
- Değişmemiş formu göndermemek gereksiz yazmaları azaltır.

**Kendini yokla:** Kayıt kimliği değişince neden alanlar kendiliğinden yenilenmeyebilir? Başlangıç değerleri yalnız form ilk kurulurken uygulanır. Hata yanıtında seçimi neden bırakırız? Kullanıcı tekrar denemek için yeniden seçim yapmak zorunda kalmasın.
