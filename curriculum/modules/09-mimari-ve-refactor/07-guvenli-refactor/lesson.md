---
title: "Davranışı koruyarak refactor et"
minutes: 17
kind: concept
---

# Davranışı koruyarak refactor et

:::pain[Problem]
Bir faturanın üç ürün türü için açıklama satırı aynı tarih kuralını tekrar ediyor. Tek seferde dosyaları taşıdın, tarihi yeniden biçimlendirdin ve boş ürün mesajını da değiştirdin. Artık boş mesajdaki hatanın taşıma mı, biçim değişikliği mi, yoksa yeni koşul mu olduğunu ayıramıyorsun.
:::

## Refactor dış sözleşmeyi tutar

Refactor, kullanıcının gözleyebildiği davranışı korurken kodun iç yapısını daha anlaşılır hale getirir. Dosya sayısı azalmak zorunda değil; tekrar eden bir işin sahibi daha netleşebilir. Yeni feature eklemek, metin değiştirmek veya hata davranışını düzeltmek ayrıca değerli olabilir ama bunlar refactor adımı değildir.

![Davranış fotoğrafından küçük refactor adımlarına ve aynı kontrole dönüş](diagrams/refactor-adimlari.svg "Her iç değişiklikten sonra dış davranış kontrol edilir.")

Kesin kurallar:

1. **Önce mevcut davranışın sınırını gözlemle.** Başarı, boş veri, geçersiz giriş ve özel ayrımlar gibi önemli çıktıları bil. Var olan testler bu gözlemi otomatikleştirebilir; yoksa önce manuel tekrar adımlarını kaydet.
2. **Bir seferde tek iç sorumluluğu değiştir.** Tekrarlanan hesaplamayı ayır, tekrar test et; sonra klasör taşı. Aynı adımda kullanıcı metnini değiştirme.
3. **Dış sözleşmeyi değişmeden tut.** Fonksiyonun sonucu, ekranın mesajı, URL davranışı veya public props bu çalışma sırasında aynı kalmalı.
4. **Testleri yeni yapıya göre değil, kullanıcı sözleşmesine göre yaz.** Test iç dosyanın varlığını kanıtlamak yerine gözlenebilir sonucu sabitlemeli. Yeni birim ayrıca public olarak isteniyorsa onun davranışı da ayrı test edilebilir.
5. **Yeşil test kalite belgesi değildir.** Test yalnız ölçtüğü davranışı korur; isimlendirme, sınırın yeri, bağımlılık yönü ve gereksiz tekrar code review/rubric konusudur.
6. **Başarısız kontrolde son küçük adıma dön.** Hatanın değişiklik kaynağını küçültmek küçük commit'in amacı gibidir; her aradaki durum derlenebilir ve anlaşılır olmalı.

Bu kurallar “önce her şeyi test et” demek değildir. Küçük, izole bir helper'ın davranışı kolayca görülebilir; büyük sayfada URL, servis ve kullanıcı etkileşimi beraber çalışır. Risk arttıkça otomatik güvenlik ağı daha değerlidir.

## Fatura açıklamasını adım adım izle

Üç ürün grubunun çıktı örnekleri şöyledir:

| Ürün tipi | Girdi | Var olan çıktı |
| --- | --- | --- |
| kitap | tarih 2024-02-12 | `Kitap · 2024` |
| oyun | boş tarih | `Oyun · Tarih yok` |
| bilet | tarih 2025-11-03 | `Bilet · 2025` |

Başlangıç davranışını önce üç temsilci girdiyle kaydet. Sonra kuralı ayırırken sırayla şu izi izle:

| Adım | Yapılan değişiklik | Beklenen kontrol |
| --- | --- | --- |
| 1 | Tekrarlanan tarih parçasının aynı mı olduğunu karşılaştır | Boş ve dolu tarih için mevcut metin belli |
| 2 | Ortak tarih üretimini bir saf fonksiyona taşı | Tek fonksiyon hem `2024` hem `Tarih yok` üretir |
| 3 | Üç ürün tipi etiketini eski sırada birleştir | Üç dış çıktı byte-byte aynı kalır |
| 4 | Eski tekrarları kaldır | Üç dal aynı formülün ayrı kopyasını tutmaz |
| 5 | Yeni sınırın public fonksiyonunu doğrudan gözle | Aynı tarih kuralları başka tüketici için de güvenilir |

Her adımda önceki dış çıktıyı kullanmak değişikliğin kapsamını daraltır. Eğer bir test kırılırsa, son ayırdığın birimin input'u yanlış olabilir. Aynı anda etiketi de değiştirmiş olsaydın, hangi değişikliği geri alacağını bilemezdin.

## Yeşil davranışın neyi kanıtladığını ayır

Şu örnek doğru çıktıyı üretse bile aynı formatı üç kez tutar:

```ts
function invoiceLabel(kind: 'book' | 'game' | 'ticket', year: string): string {
  if (kind === 'book') return `Kitap · ${year || 'Tarih yok'}`
  if (kind === 'game') return `Oyun · ${year || 'Tarih yok'}`
  return `Bilet · ${year || 'Tarih yok'}`
}
```

Bir davranış testi üç çıktıyı da kontrol ederse bu implementasyon yeşildir. Ama tekrar hâlâ vardır. Aynı çıktı üretmeye devam eden düzenlenmiş sürüm ortak parçayı bir kere belirler:

```ts check
type ProductKind = 'book' | 'game' | 'ticket'

export function displayYear(value: string): string {
  return value ? value.slice(0, 4) : 'Tarih yok'
}

export function invoiceLabel(kind: ProductKind, year: string): string {
  const labels: Record<ProductKind, string> = {
    book: 'Kitap',
    game: 'Oyun',
    ticket: 'Bilet',
  }
  return `${labels[kind]} · ${displayYear(year)}`
}
```

Burada davranış iki export'un çıktısıyla doğrulanabilir; ayrıca review'da her kind kapsanıyor mu, ortak metin tek yerde mi, helper gerçek akışta kullanılıyor mu diye bakılır. Starter davranış testinden yeşil geçebilir; bu testin görevi çalışan kodu baştan başarısız göstermek değil, kullanıcının aldığı sonucu korumaktır. Yapısal beklenti görevde açıkça istenmişse yeni birimin public kullanımı ayrı doğrulanabilir. Kaliteyi tamamen test kapsamına yüklemek de hatalıdır.

`Tarih yok` ile boş metin ayrımı gibi sınır durumlarını önceden yaz. Refactor sırasında yeni davranış icat etme: boş değer önceden boş string ise bu adımda “daha iyi” mesaj ekleme. Bunun için ayrı değişiklik açıp yeni beklentiyi birlikte güncelle.

Bir bölümü ayırmaya değer kılan şey çoğu zaman belirgin bir değişim sebebidir. Aynı hesap üç yerde kopyalanmışsa hepsi değişiklikte güncel kalmalı; saf fonksiyon ortak kuralı tek noktaya toplar. Bir component'in içinde iki kez tekrarlanan küçük markup ise onu başka yere çıkarınca import ve props maliyeti tekrarın kendisinden büyük olabilir. “Bir dosyada tek fonksiyon olsun” gibi mekanik bir hedef yerine, hangi kuralın birlikte değiştiğini izle.

Karakterizasyon testi adı verilen yaklaşım, değiştirmeden önce var olan davranışı yakalar. Testin beklentisi tuhaf görünebilir; örneğin boş tarih Tarih yok değil, boş string üretiyor olabilir. Bu testi otomatik olarak “düzeltme”; önce bunun bilinen kullanıcı sözleşmesi mi, bug mı olduğuna karar ver. Refactor görevi davranışı korumayı istiyorsa mevcut sonucu kilitlersin; bug düzeltmesi ise farklı iş kartı ve yeni beklenti gerektirir.

Testler bütün projeyi değil, seçtiğin dış yüzeyi korur. Saf format helper için input/output tablo yeterli olabilir. Asenkron sayfada görünür metinle birlikte arama sorgusu veya geri gezinme de sözleşmenin parçasıysa bu kullanıcı akışını kapsa. Bir testin kapsamı büyüdükçe hata teşhisi yavaşlar; küçük testler hangi davranışın bozulduğunu daha net söyler.

## Sınır durumları ve sık hatalar

:::mistake[Belirti: refactor bitti ama kullanıcı metni de değişti]
**Belirti →** Eski ekranda `Tarih yok`, yenisinde boş alan var. **Neden →** Davranış değişikliğiyle iç düzen aynı teslimde karışmış. **Düzeltme →** Refactor adımında eski dış sözleşmeyi koru; metin değişimini ayrı gereksinimle yap.
:::

:::mistake[Belirti: bütün testler yeşil ama kopya duruyor]
**Belirti →** Testler geçiyor, aynı format formülü üç dalda. **Neden →** Davranış testleri iç tekrar sayısını ölçmez. **Düzeltme →** Review'da tekrarın sahibi ve public sınırını incele; kalite maddesini somut bir rubric ile değerlendir.
:::

:::mistake[Belirti: tek test adı bütün uygulamayı anlatıyor]
**Belirti →** `uygulama çalışır` testi failure nedenini açıklamıyor. **Neden →** Ayrı davranışlar tek beklentiye yığılmış. **Düzeltme →** Başarı, boş, hata gibi sınırları gözlem cümleleriyle ayır.
:::

:::mistake[Belirti: yeni helper boş input'ta farklı cevap veriyor]
**Belirti →** Normal tarih testi geçiyor, boş tarihte fark çıkıyor. **Neden →** Tekrarın sınır durumu çıkarılırken unutulmuş. **Düzeltme →** Taşıma öncesi boş/null/özel değerleri de örnek davranış tablosuna ekle.
:::

:::mistake[Belirti: refactor adımının ortasında uygulama derlenmiyor]
**Belirti →** Dosyayı taşıdın ama importları sonra düzeltmeyi planladın. **Neden →** Ara durum çalışan, doğrulanabilir bir değişiklik değil. **Düzeltme →** Taşıma ve referans güncellemesini aynı küçük adımda tamamla, ardından kontrol et.
:::

:::sector
Takım code review'larında refactor PR'ları genellikle davranış değişikliklerinden ayrı tutulur. Böylece reviewer mevcut çıktıların sabit kaldığını testlerden görebilir ve yapısal faydayı ayrıca tartışabilir. Güvenlik ağı testlerdir; sürdürülebilirlik kararı net sınırlar ve okunur kodla verilir.
:::

## Özet

- Refactor iç düzeni iyileştirir, kullanıcıya görünen davranışı korur.
- Önce gözlemle, sonra tek sorumluluğu değiştirip aynı davranışı kontrol et.
- Testler yalnız ölçtükleri davranışı kanıtlar; mimari kalite ayrıca incelenir.
- Boş ve özel değerler de davranış sözleşmesinin parçasıdır.
- Yeni davranış değişimini refactor'dan ayrı tut.

**Kendini yokla:** Üç daldaki aynı mesajı tek helper'a çıkardın ve testler yeşil. Bu, tekrarı azalttığını kanıtlar mı?  
*Cevap:* Hayır. Testler çıktıların korunduğunu gösterir; helper'ın gerçek kullanımı ve tekrarın kalmaması yapısal inceleme gerektirir.

**Kendini yokla:** Boş tarih metnini de refactor sırasında değiştirmek neden riskli?  
*Cevap:* İç yapı değişikliği ile ürün davranışı karışır; hata kaynağını ayırmak zorlaşır.
