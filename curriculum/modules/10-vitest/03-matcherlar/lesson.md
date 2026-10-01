---
title: "Beklentiye uygun matcher seç"
minutes: 15
kind: concept
---

# Beklentiye uygun matcher seç

Bir filmin puan etiketi `8.0` ise bunu tam string olarak mı, içinde `8` geçen herhangi bir metin olarak mı kabul edersin? Testte kullandığın matcher, bu soruya verdiğin cevabı koda yazar. Matcher, `expect` ile verilen gerçek değeri bir kurala göre beklenen değerle karşılaştırır.

## Önce değerin kendisine bak

Önceki derste gördüğün `toBe`, string ve sayı gibi basit değerlerin tam eşitliğini kontrol eder. İlk örnekte iki film başlığının aynı metin olup olmadığına bakalım:

```ts check
import { expect, it } from 'vitest'

it('başlık etiketini tam metin olarak üretir', () => {
  const label = 'Kıyı'
  expect(label).toBe('Kıyı')
})
```

Burada yalnızca beklenen metin kabul edilir. `Kiyi` veya sonuna boşluk eklenmiş `Kıyı ` farklı string’dir ve test kalır. Kullanıcıya gösterilen metin sözleşmenin parçasıysa bu kesinlik yararlıdır.

Şimdi aynı tam eşitlik fikrini nesneye uygulayalım. JavaScript’te her `{}` yeni bir nesne oluşturur; iki nesnenin alanları aynı olsa bile bellekteki **referansları**, yani nesnenin kendisini gösteren kimlikleri, ayrı olabilir.

```ts check
import { expect, it } from 'vitest'

it('film özetini alanlarıyla karşılaştırır', () => {
  const actual = { title: 'Kıyı', year: 2024 }
  const expected = { title: 'Kıyı', year: 2024 }
  expect(actual).toEqual(expected)
})
```

`toEqual` nesnelerin içindeki değerleri ve yapıyı karşılaştırır; ayrı oluşturulmuş olmaları sorun değildir. `toBe` kullansaydın aynı referansı arar, bu iki nesne için testi başarısız kılardı. Bu yüzden ilkel değer için `toBe`, nesne ve dizinin değer yapısı için `toEqual` düşün.

## Bütün nesne mi, önemli alanlar mı?

Gerçek bir film cevabında başlık, yıl ve daha sonra eklenebilecek başka alanlar olabilir. Testin yalnızca başlıkla yılı koruması gerekiyorsa tüm cevabı sabitlemek zorunda değilsin. `toMatchObject`, nesnenin belirttiğin alanlarını bekler ve fazladan alanlara izin verir.

```ts check
import { expect, it } from 'vitest'

it('film kartı için gerekli bilgileri içerir', () => {
  const card = { title: 'Kıyı', year: 2024, language: 'tr' }
  expect(card).toMatchObject({ title: 'Kıyı' })
  expect(card).toMatchObject({ year: 2024 })
})
```

Her assertion ayrı bir bilgiyi korur; `language` fazladan alanı engel değildir. `year` yanlışsa ikinci assertion başarısız olur ve raporda hangi beklentinin bozulduğu görünür. Eski cevabı tam `toEqual` ile sabitlemek ilgisiz bir alan eklenince testi kırabilirdi; yalnızca `title` beklemek ise yıl hatasını kaçırırdı. Gerekli alt kümeyi seçmek, testi hem esnek hem anlamlı tutar.

Bu farkı adım adım görelim:

| Sıra | Gerçek cevap | Beklenti | Sonuç |
| --- | --- | --- | --- |
| 1 | `{ title: 'Kıyı', year: 2024, language: 'tr' }` | `{ title: 'Kıyı' }` | Test geçer; yıl korunmuyor |
| 2 | Aynı cevap | `{ title: 'Kıyı', year: 2024 }` | Test geçer; iki önemli alan korunuyor |
| 3 | `{ title: 'Kıyı', year: 2025, language: 'tr' }` | `{ title: 'Kıyı', year: 2024 }` | Test kalır; yıl hatası görünür |

Önemli alanlardan biri değişince testin kırılması gerekir. `toMatchObject({})` gibi boş alt küme hiçbir alanı zorunlu tutmaz. Esnek beklenti, eksik beklenti demek değildir.

![Tam değer, kısmi alan ve hata beklentisi için matcher seçimi](diagrams/matcher-secimi.svg)

## Hata da gözlenen bir sonuçtur

Bazı fonksiyonlar geçersiz girdi için hata fırlatır. Hatanın kendisini test etmek için çağrıyı `toThrow` matcher’ına callback olarak verirsin. Callback, daha sonra çağrılabilen fonksiyondur; burada Vitest’in fonksiyonu çalıştırıp hatayı yakalamasını sağlar.

```ts check
import { expect, it } from 'vitest'

function runtimeLabel(minutes: number): string {
  if (minutes < 0) throw new RangeError('Süre negatif olamaz')
  return minutes + ' dk'
}

it('negatif süreyi reddeder', () => {
  expect(() => runtimeLabel(-1)).toThrow(RangeError)
  expect(() => runtimeLabel(-1)).toThrow('Süre negatif olamaz')
})
```

`runtimeLabel(-1)` doğrudan test gövdesinde çalışsaydı hata `expect` çağrısından önce fırlardı; matcher onu yakalayamazdı. Callback verince Vitest çağrıyı kendi içinde yapar ve `RangeError` olup olmadığını kontrol eder. Hata türü davranış sözleşmesiyse türü açıkça bekle.
İkinci assertion hata mesajını da kontrol eder. İkisi birden varsa yanlış türde veya yanlış açıklamalı hata testten geçemez. `toThrow('Süre negatif olamaz')` hata mesajının belirtilen metni içerip içermediğini denetler. Stack trace gibi çalıştığı ortama bağlı ayrıntıları karşılaştırmak gereksiz kırılganlık yaratır.

## Kapsamı gereğinden fazla gevşetme

Liste sırası davranışın parçasıysa diziyi `toEqual` ile karşılaştır; `['A', 'B']` ve `['B', 'A']` aynı sonuç değildir. Sıra önemli değil, yalnızca belli filmlerin listede bulunması önemliyse `expect.arrayContaining` ile üyelik beklentisi yazabilirsin. Bu beklenti fazladan film veya tekrar olmadığını kendiliğinden kanıtlamaz; gerekiyorsa uzunluğu ve tekrarı ayrıca denetle.

Sık görülen bir hata, nesne içeriğini `toBe` ile karşılaştırmaktır:

```ts check
import { expect, it } from 'vitest'

it('nesne içeriğini karşılaştırır', () => {
  const actual = { title: 'Kıyı' }
  const expected = { title: 'Kıyı' }
  expect(actual).toBe(expected)
})
```

Belirti, aynı alan ve değerleri gördüğün halde testin kalmasıdır. Nedeni, iki nesnenin ayrı referanslar olmasıdır. Nesnenin içeriği önemliyse `toEqual` ya da gereken alanlar için `toMatchObject` kullan.

Bir başka gevşeklik, `toMatchObject({ title: 'Kıyı' })` yazıp aslında yılın da doğru olmasını beklemektir. Test geçer ama yanlış yıl gösterilebilir. Gerekli alanları düşün: her alan ayrı bir davranışsa ayrı assertion yazmak raporu anlaşılır kılar; örneğin sayfa numarası ve toplam sayfa sayısını ayrı ayrı doğrulayabilirsin.

Sayısal karşılaştırmada da kabul edilen farkı önceden belirle. Kuruş hesabı tam olmalıysa tolerans koymak hatayı saklayabilir. Ölçüm hesabında çok küçük kayan nokta farkları normalse yaklaşık eşitlik gerekebilir. Kullanıcıya gösterilen puan etiketi string ise sayısal esneklik değil, tam metin beklemek gerekir.

:::mistake[Hatalı fonksiyonu assertion’dan önce çağırmak]
**Belirti:** Test beklediğin `toThrow` sonucu yerine doğrudan hata verir. → **Neden:** Çağrı callback içine alınmamıştır. → **Düzeltme:** `expect(() => fn()).toThrow(...)` biçimini kullan.
:::

:::info[Derinlemesine (isteğe bağlı)]
**Snapshot**, önceki çalıştırmada saklanan çıktı örneğidir; sonraki çalıştırmanın çıktısıyla karşılaştırılır. Büyük çıktı sık değişiyorsa farkları incelemek zorlaşabilir. **Stack trace**, hata anında hangi fonksiyonların birbirini çağırdığını gösterir; dosya yolları ortama göre değişebileceği için genellikle test beklentisi yapılmaz. **Unicode normalizasyonu**, aynı görünen bazı karakter dizilerini ortak bir kodlamaya dönüştürür; bunu ancak ürün metni özellikle normalize ediyorsa uygula. **Derin matcher bileşimi**, `expect.objectContaining` gibi bir matcher’ı başka bir matcher’ın içine koyup iç içe nesnenin yalnız bir kısmını karşılaştırmaktır. Bu ayrıntılar burada gereken temel seçimden ötedir.
:::

## Özet

- `toBe` basit değerlerin tam eşitliği ve referans kimliği içindir; `toEqual` nesne/dizi değer yapısını karşılaştırır.
- `toMatchObject` gerekli alanları sabitler, fazladan alanları kabul eder.
- `toThrow` hata üreten çağrıyı callback olarak alır; gerekirse hata türünü veya mesajını bekle.
- Liste sırası, uzunluğu ve üyelik beklentisini gerçek davranışa göre seç.
- Her assertion, önemli bir hatayı yakalayacak kadar kesin olmalı.

**Yeni terimler**

- **Matcher:** Gerçek değeri beklenen koşulla karşılaştıran `toBe` gibi araç.
- **Referans kimliği:** Nesnenin bellekte hangi nesne olduğunu gösteren kimlik; aynı alanlara sahip iki ayrı nesne farklı referansa sahiptir.
- **Callback:** Daha sonra çağrılmak üzere fonksiyon olarak verilen davranış.
- **Snapshot:** Çıktının saklanan örneğini sonraki çalıştırmayla karşılaştırma yöntemi.
- **Stack trace:** Hata oluştuğunda hangi fonksiyon çağrılarının izlediğini gösteren kayıt.
- **Unicode normalizasyonu:** Görünüşü aynı bazı metin karakterlerini ortak kodlamaya dönüştürme.
- **Derin matcher bileşimi:** İç içe veride alt matcher kullanarak kısmi karşılaştırma kurma.

**Kendini yokla:** Cevap nesnesine yeni alan eklenebilir ama `page` ve `total_pages` sabit kalmalı. Hangi yaklaşım? Bu iki alanı `toMatchObject` ile bekle; alan başına ayrı assertion da yazabilirsin.

**Kendini yokla:** `RangeError` beklerken neden `expect(() => fn())` yazarsın? Callback sayesinde matcher fonksiyonu çağırıp fırlayan hatayı yakalayabilir.
