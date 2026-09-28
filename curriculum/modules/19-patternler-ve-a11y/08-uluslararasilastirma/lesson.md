---
title: "Yerel biçimlendirme ve tipli mesajlar"
minutes: 18
kind: concept
---

# Yerel biçimlendirme ve tipli mesajlar

:::pain[Problem]
Sinema'da bir biletin fiyatı `1234.5` diye, gösterim tarihi `2026-09-28` diye görünüyor. Türkçe aramada “Işık” bulunmuyor; başlıklar da Türk alfabesindeki sırayı izlemiyor. Bu değerler makine için geçerli, ama ekranda kullanıcının diline ait kuralları taşımıyor.
:::

## Makine değeri ile kullanıcı metnini ayır

Uygulamanın içinde `1234.5`, ISO tarih metni veya bir film başlığı gibi değerleri saklamak ile onları kullanıcıya göstermek farklı işlerdir. Makine değeri hesaplama ve ağ iletişimi için sabit kalır. Görünen metin ise dile, ülkeye ve bazen kullanıcının tercihlerine göre biçimlenir.

:::model[Locale bir görüntüleme kuralıdır]
Locale, sayı veya metin için tek bir “çeviri” değildir. `tr-TR`, ondalık ayırıcı, para birimi gösterimi, harf dönüşümü ve sıralama gibi ayrı işlemlere kendi kurallarını verir. Kaynak değeri değiştirmez; ekranda kullanacağın gösterimi üretir.
:::

![Locale girdisinin farklı Intl araçlarına ve kullanıcıya gösterilen sonuca akışını anlatan diyagram](diagrams/intl-akisi.svg "Makine değeri korunur; gösterim locale kurallarından geçer.")

Kesin kurallar:

1. **Ham değeri makine biçiminde tut.** Fiyatı sayı, zamanı `Date` ya da standart tarih değeri, kimliği değişmez bir string olarak sakla. Görünen `₺1.234,50` metnini tekrar sayıya çevirmeye çalışma.
2. **Her gösterim için uygun aracı seç.** Sayı ve para için `Intl.NumberFormat`, takvim tarihi için `Intl.DateTimeFormat`, “dün” gibi göreli süreler için `Intl.RelativeTimeFormat` kullan.
3. **Dil kuralını çağrı noktasında belirt.** Uygulamanın dili açıkça `tr-TR` ise, tarayıcının varsayılan dilinin aynı olduğunu varsayma. `Intl` seçenekleri bu kararı görünür kılar.
4. **Harf ve sıralama kurallarını da locale'e bağla.** Arama için `toLocaleLowerCase('tr-TR')`; sıralama için `Intl.Collator('tr-TR')` kullan. Normal `toLowerCase()` ve varsayılan `sort()` Türkçe I ayrımını ya da alfabe sırasını bilmez.
5. **Mesajın dilbilgisini sayıya göre seç.** `Intl.PluralRules` dilin çoğul kategorisini seçer. Her dilde tekil-çoğul kuralı `n === 1` değildir.
6. **Belge dilini ve yönünü ayrı bildir.** HTML kökünde `lang="tr"` ekran okuyucu ve tarayıcıya dili söyler; `dir="rtl"` yazı yönünü belirtir. Biri diğerinin yerini tutmaz.

## Bir fiyat ve tarih ekranda nasıl biçimlenir?

Bir bilet servisinden `price = 1234.5` ve `startsAt = new Date('2026-10-03T18:30:00Z')` geldiğini düşün. Ham para birimi sayı olarak kalır. Tarih de tarih nesnesidir. Görünen metni render sırasında üretirsin:

```ts check
const price = 1234.5
const startsAt = new Date('2026-10-03T18:30:00Z')

const priceText = new Intl.NumberFormat('tr-TR', {
  style: 'currency',
  currency: 'TRY',
}).format(price)

const dateText = new Intl.DateTimeFormat('tr-TR', {
  dateStyle: 'long',
  timeStyle: 'short',
  timeZone: 'Europe/Istanbul',
}).format(startsAt)

const relativeText = new Intl.RelativeTimeFormat('tr-TR', {
  numeric: 'auto',
}).format(-1, 'day')

console.log(priceText, dateText, relativeText)
```

`NumberFormat` için `style: 'currency'` tek başına yeterli değildir; para birimi kodunu da vermelisin. Bir oran göstereceksen `style: 'percent'`, kısa büyük sayılar için `notation: 'compact'` seçeneği kullanılabilir. `DateTimeFormat` ise kullanıcının diline uygun sırayı, ay adını ve noktalama işaretini üretir. Saat dilimini belirtmek, aynı anın farklı makinelerde başka gün görünmesini önler.

Bir sayıdan mesajın hangi biçimini seçeceğini `PluralRules` belirler. Örneğin Türkçede `1` için kategori `one`, `3` için `other` olur; iki cümlede de “film” kelimesi değişmeyebilir. İngilizcede `1 movie` ve `3 movies` ayrımı gerekir. Kategorileri tahmin edip if zincirine gömmek yerine Intl'den sor:

```ts check
const englishPlural = new Intl.PluralRules('en').select(3)
const turkishPlural = new Intl.PluralRules('tr-TR').select(3)
const englishText = englishPlural === 'one' ? 'movie' : 'movies'
const turkishText = turkishPlural === 'one' ? 'film' : 'film'

console.log(englishText, turkishText)
```

## Türkçe I harfini izleyelim

Bir ziyaretçi arama kutusuna `ipek` yazdı; katalogdaki başlık `İpek`. Genel küçük harf dönüşümüyle iki taraf da aynı değere inmez. Locale'i ekleyince dönüşüm Türkçe kurala göre yapılır.

| Adım | Başlık | Sorgu | Sonuç |
| --- | --- | --- | --- |
| 1. Başlangıç | `İpek` | `ipek` | Farklı karakter kodları var |
| 2. `toLowerCase()` | `i̇pek` | `ipek` | İlk değer birleşik noktalı biçimde kalır; eşit değiller |
| 3. `toLocaleLowerCase('tr-TR')` | `ipek` | `ipek` | Türkçe locale iki tarafı eşler |

Sıralama başka bir işlemdir. `['Şule', 'İpek', 'Çetin', 'Işık'].sort()` karakter kodlarına göre hareket eder; Türk alfabesinin sırasını uygulamaz. `new Intl.Collator('tr-TR').compare(a, b)` ise karşılaştırma sonucunu locale'e göre verir. `filter` ve `sort` aynı yardımcıda kullanılabilir; ama sıralama kaynak diziyi değiştirmesin diye `toSorted` ya da kopya üzerinde `sort` kullan.

## Önce kırık, sonra doğru

Bu örnek İngilizce başlıkların yerel alfabetik sırasını umursamadan sıralar ve Türkçe I harflerini aramada eşleştiremez:

```ts check
type Event = { name: string }

function findEvents(events: Event[], query: string): Event[] {
  const result = events.filter((event) => event.name.toLowerCase().includes(query.toLowerCase()))
  return result.sort((a, b) => a.name.localeCompare(b.name))
}
```

Burada locale verilmediği için aynı kod kullanıcının beklediği Türkçe kuralları garanti etmez. Karşılaştırma ve sıralama için locale'i açıkça verir, sıralamadan önce kopya üretiriz:

```ts check
type Event = { name: string }
const turkishCollator = new Intl.Collator('tr-TR')

function findEvents(events: Event[], query: string): Event[] {
  const needle = query.trim().toLocaleLowerCase('tr-TR')
  return events
    .filter((event) => event.name.toLocaleLowerCase('tr-TR').includes(needle))
    .toSorted((a, b) => turkishCollator.compare(a.name, b.name))
}
```

Buradaki örnek yalnızca dil duyarlı harf eşleştirir; `s` ile `ş` harfini aynı yapmaz. Aksanları yok saymak ürün kararıdır. Her karakterden birleşik işaretleri gelişigüzel silmek, kullanıcıların gerçekten ayırt ettiği adları da birbirine karıştırabilir.

## Mesaj kataloğunda anahtar ve parametre

`Intl` sayı ve tarihleri biçimlendirir, ama arayüz cümlelerini çevirmeyi üstlenmez. “Merhaba, Ada” ile “Welcome, Ada” gibi metinler için dil bazlı bir katalog gerekir. Katalog anahtarlarını tek yerden türetmek yazım hatalarını ve eksik çevirileri görünür yapar.

```ts check
const messages = {
  tr: { greeting: (name: string) => `Merhaba, ${name}` },
  en: { greeting: (name: string) => `Welcome, ${name}` },
} as const

type MessageKey = keyof typeof messages.tr

function greet(key: MessageKey, name: string, locale: keyof typeof messages): string {
  return messages[locale][key](name)
}

const greeting = greet('greeting', 'Ada', 'tr')
```

Bu küçük örnek sabit parametre imzasını gösteriyor. Gerçek kataloglarda her mesajın parametresi farklı olabilir; `keyof`, generics ve `Parameters` ile seçilen anahtardan doğru parametre tipini çıkarabilirsin. Bu yaklaşımda `'greting'` gibi yanlış anahtar ve yanlış veri derleme aşamasında yakalanır. Katalog büyüdüğünde bu yapıyı kendin sürdürmek yerine FormatJS, Lingui veya react-i18next gibi kütüphaneler çeviri dosyası yükleme, plural mesajı ve biçimlendirmeyi yönetebilir. Bu repoda bu paketler kurulu değil; burada önemli olan deseni tanımak.

## Dil yönü ve CSS yerleşimi

Sayfanın dili ekranda görünmeyen ama tarayıcının ihtiyaç duyduğu bilgidir. Türkçe belge `<html lang="tr">` taşır. Sağdan sola bir Arapça sayfa için `lang="ar"` ve `dir="rtl"` kullanılır. CSS'te `margin-left` gibi fiziksel yön yerine `margin-inline-start` ve `padding-inline-end` gibi mantıksal özellikler seçersen aynı bileşen iki yönde de doğru yerleşir. Tailwind'de bunların `ms-*`, `me-*`, `ps-*` karşılıkları vardır.

:::mistake[Belirti: Fiyatı tekrar sayıya çeviremiyorsun]
Belirti → Arayüzde `₺1.234,50` var; hesap kodu bu metni `Number(...)` ile okuyup `NaN` üretiyor.  
Neden → Biçimlendirilmiş görünüm ham veri olarak saklanmış.  
Düzeltme → `1234.5` sayısını state/API verisinde koru, yalnızca render sırasında `Intl.NumberFormat` kullan.
:::

:::mistake[Belirti: Türkçe isim yanlış sırada]
Belirti → `Çetin`, `Işık`, `İpek`, `Şule` yerine İngilizce ya da kod sırası görünüyor.  
Neden → Varsayılan `sort()` locale seçimi yapmıyor.  
Düzeltme → `Intl.Collator('tr-TR')` ile karşılaştır; farklı ekranlarda başka dil kullanılıyorsa locale'i o dilin tercihiyle belirle.
:::

:::mistake[Belirti: Dil değişince bazı mesajlar kayboluyor]
Belirti → İngilizce ekranda selamlama çevriliyor ama sonuç sayacı Türkçe kalıyor.  
Neden → Metinler bileşenlere dağılmış ve katalog anahtarları iki dilde karşılaştırılmıyor.  
Düzeltme → Mesajları dil bazlı katalogda tut; TypeScript ile anahtar kümesinin ve parametre imzalarının eşleşmesini sağla.
:::

:::sector
Ürün ekipleri kod incelemesinde “bu string hangi locale ile biçimleniyor?” sorusunu sorar. API'den gelen ISO tarihini saklar, arayüzde kullanıcının seçtiği saat dilimi ve locale ile gösterirler. Büyük uygulamalarda çeviri anahtarlarını çeviri yönetim sisteminden alır, `Intl` biçimlendiricilerini ortak bir katmanda sunar ve ekran okuyucu için belge dilini de güncel tutarlar.
:::

## Özet

- Makine değerini biçimlenmiş kullanıcı metninden ayrı tut.
- Sayı, tarih, göreli zaman ve çoğul seçiminde uygun `Intl` sınıfını kullan.
- Türkçe harf dönüşümü ile sıralamaya locale ver; varsayılan string metotlarının dil kuralını bildiğini varsayma.
- Mesaj kataloğunda anahtar ve parametreleri tipli tut; belge `lang` ve `dir` bilgisini de doğru ayarla.

**Kendini yokla:** Para metnini neden uygulama state'inde saklamazsın?  
*Cevap:* Çünkü bu gösterim locale'e bağlıdır; ham sayı kalırsa başka dilde yeniden biçimlendirmek ve hesap yapmak mümkündür.

**Kendini yokla:** `Intl.Collator` ile `Intl.NumberFormat` neyi farklı çözer?  
*Cevap:* Collator metinleri dile göre karşılaştırır; NumberFormat sayısal değerleri yerel yazım kuralıyla gösterir.
