---
title: "Sinema'da liste ve yorum formları"
minutes: 6
kind: project
---

# Sinema'da liste ve yorum formları

:::pain[İki form, iki ayrı kayıt hedefi]
Sinema'da izleme listesi tarayıcıda saklanmalı; yorum ise ağ üzerinden gönderilmeli. Bir form localStorage'a yazar, diğeri bekleyen isteği ve sunucu reddini yönetir. Aynı alan arayüzü, farklı kayıt sözleşmelerine sahip.
:::

## Önce verinin sahibini bul

:::model[Form deposu ve abonelik]
Form değerleri ve alan hataları RHF deposunda, ağ pending/success/error durumu mutation'dadır. İzleme listesi formu kalıcı tarayıcı depoya, yorum formu uzak API'ye yazar; yeni bağlamda değişen, submit sonrası hangi kaynağın güncelleneceğidir.
:::

İzleme listesi akışında tam domain kaydı `id` ve `createdAt` gibi formun üretmediği alanları da taşır. Form girdisini bu iki alan olmadan türet; saklama katmanı yeni kimlik/zaman üretir ve listeleri tekrar okunabilir kılar. Etiketler değişken sayıda satırdır, dolayısıyla silme sonrası hem sıralama hem değer eşleşmesi korunmalıdır.

Yorum akışında yıldız seçimi özel controlled arayüzdür, yorum metni native textarea'dır. İkisini aynı RHF form değerinde topla; fakat DummyJSON yorum sözleşmesinde yalnız metin, post kimliği ve kullanıcı kimliği vardır. UI'deki puanı gönderilecek gövdeye ekleme. Sunucu cevabını, hata mesajını ve alan hatalarını ayrı tut.

## Çalışırken izleyeceğin sorular

- Alan label'ı ve hata mesajı programatik olarak bağlı mı?
- Kayıt nesnesi formdan mı türetiliyor, yoksa sunucuya ait kimlikler yanlışlıkla form girdisine mi eklenmiş?
- Satır silince kalan etiketler beklenen sırada mı?
- Bekleyen ağ isteğinde çift gönderim engelleniyor mu?
- Hata sonrasında kullanıcı metni ve seçimi korunuyor mu?
- Başarı sonrası sıfırlama veya yerel güncelleme yalnızca kayıt tamamlanınca mı çalışıyor?

:::sector
Takımda form, domain ve transport tiplerini ayrı düşün; her veri hedefine yalnız kabul ettiği alanları gönder. Bir formun localStorage'a yazması onu güvenilir sunucu verisi yapmaz; tarayıcı deposunu bozuk/eski veri açısından yine ele al.
:::

## Özet ve kendini yokla

- İzleme listesi yerel kalıcı kayıt, yorum ise asenkron HTTP mutation'ıdır.
- Özel yıldız seçimi form deposuna bağlanır; transport gövdesi UI alanlarından farklı olabilir.
- Hata halinde veriyi koru, başarı halinde geri bildirim ver.

**Kendini yokla:** Yıldız puanı neden yorum isteğinin JSON'una eklenmez? Endpoint sözleşmesinde yoktur. API isteği hata verince formu ne zaman temizlemelisin? Başarılı cevap geldikten sonra.
