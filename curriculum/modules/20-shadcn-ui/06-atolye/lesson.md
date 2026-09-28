---
title: "Paylaşılan UI ve form"
minutes: 5
kind: practice
---

# Paylaşılan UI ve form

:::pain[Problem]
Onay penceresi bir ekranda Escape ile kapanıyor ve focus'u geri veriyor; ikinci ekranda aynı pencere fareyle kapanıyor ama focus kayboluyor. Düzenleme formu kayıt değişince eski değeri tutuyor. Yorum alanı da sunucu reddedince yazılanları silebiliyor.
:::

Bu atölyede dosya ve yöntem seçimi sana ait. Her görev kullanıcıya görünen bir belirtiden başlar. Önce onu önizlemede üret, sonra arayüzün hangi davranışı koruması gerektiğini netleştir. İlk görevde ortak pencere davranışını farklı ekranlarda tutarlı hale getirirsin. İkinci görevde açık pencere yeni kayda geçtiğinde alanların da güncellenmesini sağlarsın. Üçüncü görevde alanlar arası doğrulama ve sunucu başarısızlığı aynı formda buluşur.

:::model[Veri akışı]
19. modüldeki compound modelinde parçalar ortak etkileşim bağlamını paylaşır; `asChild` ise trigger'ın link gibi doğru DOM semantiğini korumasını sağlar. Atölyede bu davranışı küçük, yeniden kullanılabilir bileşen sınırlarıyla sürdür. Form tarafında değerler RHF'ten, doğrulama Zod'dan, erişilebilir ad ve hata bağları DOM'dan gelir; bunları tek bir kaynağa karıştırma.
:::

## Belirtiden karara

| Belirti | İlk soru |
| --- | --- |
| İkinci pencerede focus kayboluyor | Hangi düğme açtı ve kapandıktan sonra odak nereye dönmeli? |
| Kayıt değişti ama alan değişmedi | Form hangi kayda ait ve bu kimlik ne zaman değişti? |
| Kısa yorum gönderilmeye çalıştı | Kural tek alana mı, birden çok alana mı ait? |
| Sunucu hata verdi | Yeniden deneme için hangi kullanıcı verisi korunmalı? |

:::mistake[Mutlu yolu tek başına düzeltmek]
Belirti → Bir örnek doğru çalışıyor ama ikinci kayıtta eski metin görünüyor. Neden → İlk render'daki değerle sonraki prop değişimi aynı kabul edildi. Düzeltme → Aynı etkileşimi farklı kayıtla ve hata/başarı geçişiyle yeniden dene.
:::

:::sector
Bakım görevleri çoğu zaman “modal bozuk” diye başlar, çözümü söylemez. Deneyimli geliştirici önce tekrar adımlarını sabitler, sonra state sahipliğini ve erişilebilir etkileşimi izler. Küçük bir public component'i iki yerde kullanmak, aynı davranışın tekrar tekrar farklılaşmasını önler.
:::

## Özet

- Belirtiyi üret, sonra beklenen kullanıcı davranışını tarif et.
- Kayıt kimliği, form verisi ve geçici hata durumlarını ayrı düşün.
- Aynı bileşen iki bağlamda çalışırken focus ve veri güncellemesini tekrar dene.

Kendini yokla: Pencere açıkken kayıt değiştiğinde ilk neyi karşılaştırırsın? Cevap: Alanların güncel record prop'unu izleyip izlemediğini.
