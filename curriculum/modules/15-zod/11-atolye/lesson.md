---
title: "Kurallar ve veri değişimi"
minutes: 5
kind: practice
---

# Kurallar ve veri değişimi

:::pain[Problem]
İzleme planında bitiş tarihi başlangıçtan önce seçilebiliyor; kimse uyarmıyor. Taslak formunda başka bir kayıt seçilince eski değerler kalıyor, boş tarih ise bazen sorunsuz bazen hatalı ele alınıyor.
:::

:::model[Tip derlemede, veri çalışma anında]
Form alanları kullanıcı girdisidir; Zod parse etmeden önce güvenilir kabul edilmez. Birden çok alanı ilgilendiren kural nesne düzeyinde kurulur. Yeni bir taslak seçildiğinde ise formun başlangıç değerleri değişmiştir; şema doğrulaması ile form state'inin yenilenmesi ayrı işlerdir.
:::

## Önce davranışı tarif et

İki alıştırmada da amaç, Zod API'sini ezbere çağırmak değil, ekrandaki duruma göre doğru sözleşmeyi seçmek. İlk formda her tarih ayrı ayrı geçerli olabilir ama aralarındaki sıra yanlış olabilir. İkinci formda aynı bileşen farklı taslak verisi alır; ekranda yeni taslağın değerleri görünmeli. Ayrıca tarih alanı boş bırakılabiliyorsa boş metin ile hatalı tarih metnini ayır.

Görevlerde beklenen davranışları kısa bir tabloya çevir:

| Girdi / olay | Beklenen sonuç |
| --- | --- |
| Bitiş tarihi başlangıçtan önce | İlgili alan altında hata, form gönderilmez |
| Geçerli tarih aralığı | Submit callback'i girilen değerleri alır |
| Başka taslak seçildi | Başlık ve tarih yeni taslaktan görünür |
| Tarih alanı boş | “Tarih yok” olarak kabul edilebilir |
| Tarih alanına anlamsız metin | Açıklayıcı hata, kayıt yapılmaz |

Önce belirtileri yeniden üret, sonra hangi katmanın karar vermesi gerektiğini bul. Bir tarih ilişkisi şema kuralıdır ve kullanıcıya hangi alanın yanlış olduğunu söylemelidir. Prop değişince alanların yenilenmesi ise RHF form state'ine yeni başlangıç değerini uygulatma problemidir. Boş stringin “değer girilmedi” anlamına gelmesi de formun ham değerini submit sözleşmesine dönüştürme kararıdır.

İpuçlarına takıldığında sırayla bak: önce sorunun ne zaman ortaya çıktığını ayır; sonra uygun şema veya form API'sini seç; en sonda yalnızca gerekli iskeleti uygula. İki problemi tek dev şemada çözmeye çalışma. Ayrı sorumlulukları ayrı adımlarda düşünmek, yeni belirtiyi gördüğünde nereden başlayacağını öğretir.

:::mistake[Sık hata]
Belirti → Başka kayıt seçilse de önceki başlık ekranda kalır. Neden → Form varsayılanları yalnızca ilk mount'ta alınmıştır. Düzeltme → Yeni draft geldiğinde form state'ini o kayıtla yeniden eşitle.
:::

:::sector
Ürün formlarında boş tarih, tarih bilinmiyor anlamına gelebilir; hatalı tarih metni ise kullanıcının düzeltmesi gereken bir girdidir. Bu iki durumu API payload'ına aynı string olarak yollama. Form state'ini ve kayıt sözleşmesini açık tutmak, düzenleme ekranlarında eski verinin yanlış kayda yazılmasını önler.
:::

## Özet

- Alanlar arası koşulu nesne sözleşmesinde tanımla ve hatayı doğru alana bağla.
- Seçili kayıt değişince formun gösterdiği değerleri yeni kayda eşitle.
- Boş girdi ile biçimi yanlış girdiyi ayrı durumlar olarak ele al.

**Kendini yokla:** İki tarih de biçim olarak geçerliyse tarih aralığı kuralı neden hâlâ kalabilir?  
*Cevap:* Alanların tek tek doğruluğu aralarındaki sıralamayı garanti etmez.
