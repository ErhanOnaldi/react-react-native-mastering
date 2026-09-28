---
title: "Tipleri bir arada kullan"
minutes: 7
kind: practice
---

# Tipleri bir arada kullan

:::pain[Problem]
Rota arşivinde üç farklı koleksiyon aynı sayfalama alanlarını taşıyor. Yeni endpoint yolu eklenince yanlış cevap biçiminin seçilmesi kolaylaşıyor; ayrıca yükleme başlarken eski sonuçlar ekranda kalabiliyor.
:::

## Endpoint sözleşmesini bağla

Birinci alıştırmada yolu ve cevabı aynı tip haritasında tutacaksın. `keyof` ile izinli yolları çıkar, generic anahtarı indeksli erişim tipiyle eşleştir. Böylece tek bir route string'i, kendi cevap tipini belirler.

:::model[Generics, `keyof` ve indeksli erişim]
Generic parametre, çağrıda seçilen anahtar tipini taşır. `K extends keyof Map` yalnız geçerli yolları kabul eder; `Map[K]` de o yolun cevap tipini döndürür. Yeni bağlamda sabit bir liste cevabını ve tekil detay cevabını aynı API'de güvenle ayırıyorsun.
:::

## Durum geçişini ayrı düşün

İkinci alıştırmada `RemoteData<T>` için olayları işleyeceksin. Her yeni istek önce `loading` olur; eski başarı verisini taşımaz. Başarı sadece veriyi, hata sadece mesajı taşır. Böylece önceki sonuçla yeni isteğin sonucu aynı anda görünmez.

:::model[Discriminated union ve exhaustive kontrol]
`status` kontrolü union'ı daraltır ve dalın alanını açar. `switch` ile her durumu ele al; `never` kontrolü eklenince sonradan eklenen yeni bir eylem sessizce atlanamaz. Bu derste yeni nokta, union'ı yalnızca göstermek değil, saf bir geçiş fonksiyonunda yeni durum üretmektir.
:::

## Testleri de okuyarak yaz

Yeni alıştırmada implementasyonu değiştirmeden bir saf fonksiyonun davranışını testlerle kilitleyeceksin. Başlangıç ve güncelleme verisini küçük tut; her testte bir davranış iddiası kur ve çıktıyı beklenen nesneyle karşılaştır. Kenar durumunu seçerken sadece mutlu yolu değil, eski hata ve eski sonuç gibi önceki state değerlerini de düşün.

Bu testler ağ veya React gerektirmez. Fonksiyonun girdisi ve çıktısı yeterlidir; böylece testin neden geçtiğini hata ayıklamak kolay kalır.

## Özet

- Endpoint anahtarı ile cevap tipi aynı haritadan türetilir.
- Yeni loading durumu eski başarı verisini taşımamalıdır.
- Saf fonksiyonun geçişleri için küçük, davranış odaklı test yaz.

**Kendini yokla:** Bir endpoint haritasında `Map[K]` neyi korur?  
*Cevap:* Seçilen yolun kendisine ait cevap tipini.
