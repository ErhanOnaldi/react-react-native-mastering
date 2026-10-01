---
title: "Sinema arayüzünü farklı dillere uydurmak"
minutes: 16
kind: concept
---

# Sinema arayüzünü farklı dillere uydurmak

Sinema'da bir biletin fiyatı `1234.5` olarak gelir. Bu sayı hesap için kullanışlıdır; ekranda ise Türkçe kullanıcı `₺1.234,50` görmeyi bekler. Aynı veri farklı dillerde farklı gösterilebilir, o yüzden makine değerini koruyup ekranda ayrı biçim üretiriz.

## Sayı aynı kalır, gösterimi değişir

Bir **locale**, dil ve bölge için sayı, tarih, metin karşılaştırması gibi yazım kurallarının adıdır; örneğin `tr-TR` Türkçe ve Türkiye kurallarını seçer. JavaScript'in **Intl** API'si bu kuralları kullanarak ekrana hazır metin üretir.

İlk örnekte yalnızca fiyatı biçimlendiriyoruz:

```ts check
const price = 1234.5
const priceText = new Intl.NumberFormat('tr-TR', {
  style: 'currency',
  currency: 'TRY',
}).format(price)

console.log(price, priceText)
```

`price` hâlâ `1234.5`; `priceText` ise `₺1.234,50` gibi görünür. Hesap yaparken veya API'ye veri gönderirken ham sayıyı kullan, kullanıcıya gösterirken biçimlendirilmiş metni üret. Görünen metni tekrar sayıya çevirmeye çalışırsan binlik ve ondalık ayırıcıları yüzünden `NaN` alabilirsin.

İkinci örnekte aynı yaklaşımı gösterim tarihine uygulayalım. Yeni olan, sayıya uygun sınıf yerine tarihe uygun sınıf seçmek:

```ts check
const startsAt = new Date('2026-10-03T18:30:00Z')
const dateText = new Intl.DateTimeFormat('tr-TR', {
  dateStyle: 'long',
  timeStyle: 'short',
  timeZone: 'Europe/Istanbul',
}).format(startsAt)

console.log(dateText)
```

Ham tarih aynı anı temsil eder; `Intl.DateTimeFormat` ise ay adını ve sıra düzenini Türkçe gösterir. Saat dilimini de seçtik, çünkü aynı an bir şehirde başka bir saate, hatta başka bir güne denk gelebilir. “Dün” gibi göreli metin için ayrıca `Intl.RelativeTimeFormat` vardır; her görünüm türü için uygun biçimlendiriciyi seçmek gerekir.

![Makine değeri locale ve Intl biçimlendirmesinden geçerek kullanıcıya gösterilir](diagrams/intl-akisi.svg "Makine değeri korunur; gösterim locale kurallarından geçer.")

## Türkçe arama ve sıralama ayrı işler

Bir film başlığı `İpek`, arama kutusundaki sorgu `ipek` olsun. JavaScript'in `toLowerCase()` metodu her zaman Türkçe kuralları uygulamaz. Türkçe için `toLocaleLowerCase('tr-TR')` kullanınca noktalı ve noktasız I harfleri beklenen biçimde dönüşür.

| Adım | Başlık | Sorgu | Sonuç |
| --- | --- | --- | --- |
| Başlangıç | `İpek` | `ipek` | Metinler aynı değil |
| `toLowerCase()` | `i̇pek` | `ipek` | Başlığın ilk harfi farklı birleşik karakterlerle temsil edilir |
| `toLocaleLowerCase('tr-TR')` | `ipek` | `ipek` | Türkçe kurala göre eşleşir |

Bu dönüşüm yalnızca harf karşılaştırmasına yarar; `ş` ile `s` harfini aynı saymaz. Aksanları yok saymak isteniyorsa bu ürünün bilinçli bir kararı olmalı, çünkü bu harfler bazı adlarda anlamı değiştirir.

Şimdi üçüncü örnekte bu aramaya sıralama ekleyelim. **`Intl.Collator`**, metinleri seçtiğin locale'in alfabetik kurallarıyla karşılaştıran araçtır. Varsayılan `sort()` ise metinleri UTF-16 kod birimlerine göre karşılaştırır; **UTF-16** JavaScript'in string karakterlerini temsil etmek için kullandığı kodlama biçimidir, alfabe sırası değildir.

```ts check
type Screening = { title: string; room: string }
const collator = new Intl.Collator('tr-TR')

function searchScreenings(items: Screening[], query: string): Screening[] {
  const needle = query.trim().toLocaleLowerCase('tr-TR')
  return items
    .filter((item) => item.title.toLocaleLowerCase('tr-TR').includes(needle))
    .toSorted((a, b) => collator.compare(a.title, b.title))
}
```

Arama ve sıralama iki ayrı adımdır: `filter` sorguyu başlıklarda bulur, `Collator` bulunanları Türk alfabesine göre dizer. `toSorted` yeni dizi verir; kaynak liste değişmeden kalır. Böylece aynı film listesini başka ekranda farklı sırayla göstermek istediğinde asıl veriyi bozmazsın.

## Mesajların da farklı bilgileri olabilir

Fiyat veya tarih biçimlendirici, “Seans ertelendi” gibi arayüz cümlelerini çevirmeyi üstlenmez. Bu metinleri dil bazlı bir mesaj kataloğunda tutabilirsin. **Discriminated union**, nesneleri ayırt edici bir alanın değerine göre farklı şekillere ayıran TypeScript tipidir; her mesaj çeşidinin yalnızca ihtiyacı olan bilgiyi taşımasını sağlar.

Örneğin bir duyuru ya seansın açıldığını ya da salon değişikliğini anlatabilir:

```ts check
type Notice =
  | { kind: 'opened'; filmTitle: string }
  | { kind: 'roomChanged'; room: string }

function noticeText(notice: Notice): string {
  if (notice.kind === 'opened') return `${notice.filmTitle} için seans açıldı`
  return `Yeni salon: ${notice.room}`
}
```

`kind` değerini kontrol edince TypeScript doğru dala ait alanları tanır: `opened` dalında `filmTitle`, diğerinde `room` vardır. Bu yaklaşım hatalı karışımları azaltır; örneğin salon değişikliği mesajına film başlığı vermek zorunda kalmazsın. Bir katalogda aynı fikirle her mesaj anahtarının parametrelerini doğru dilde üretebilirsin.

## Dil, yazı yönü ve boşluk

HTML'deki `lang` niteliği belge dilini belirtir; örneğin Türkçe sayfanın kökünde `lang="tr"` bulunur. `dir` ise yazı yönünü belirtir; sağdan sola bir dilde `dir="rtl"` kullanılır. Bunlar ayrı bilgilerdir: dil Türkçe olsa da yön soldan sağadır, Arapça için dil ve yön ayrı ayrı bildirilir.

CSS'te `margin-left` gibi **fiziksel özellikler** ekranın soluna bağlanır. **Mantıksal CSS özellikleri**, boşluğu ekranın yönüne değil metnin akışına göre tarif eder; `margin-inline-start` başlangıç tarafındaki boşluktur ve sağdan sola düzende uygun tarafa geçer. Böylece yeni bir dil için her component'te sol ve sağı elle tersine çevirmen gerekmez.

```css
.film-meta {
  margin-inline-start: 0.75rem;
  padding-inline-end: 1rem;
}
```

`dir="rtl"` verilince bu boşluklar metnin akışına göre yer değiştirir. Sadece yatay düzeni değil, ikonların ve okların anlamını da kontrol et; her görsel yön tersine çevrilmek zorunda değildir.

:::mistake[Belirti: Fiyatı tekrar sayıya çeviremiyorsun]
Belirti → Ekrandaki `₺1.234,50` değerini `Number(...)` ile okuyunca `NaN` çıkıyor.  
Neden → Kullanıcıya gösterilen metni ham veri yerine saklamışsın.  
Düzeltme → Sayıyı state veya API verisinde tut, yalnızca gösterirken `Intl.NumberFormat` çağır.
:::

:::mistake[Belirti: Türkçe film adları yanlış sırada]
Belirti → `Çetin`, `Işık`, `İpek`, `Şule` Türk alfabesindeki sırayı izlemiyor.  
Neden → Varsayılan `sort()` locale seçmez.  
Düzeltme → `Intl.Collator('tr-TR')` ile karşılaştır.
:::

:::info[Derinlemesine (isteğe bağlı)]
`Intl.PluralRules` sayıya göre dilin çoğul kategorisini seçer; örneğin bazı dillerde İngilizcedeki `movie`/`movies` ayrımını üretmeye yardım eder. Kategoriler dile göre değiştiği için `count === 1` kuralını her dilde doğru varsayma. Büyük projelerde FormatJS, Lingui veya react-i18next mesaj kataloglarını yönetebilir.
:::

## Özet

- Ham fiyatı ve tarihi koru; kullanıcıya gösterilecek metni uygun `Intl` sınıfıyla üret.
- Türkçe küçük harf dönüşümünde `toLocaleLowerCase`, sıralamada `Intl.Collator` kullan.
- Arama ve sıralama farklı işlerdir; sıralarken kaynak diziyi değiştirme.
- Belgenin dilini `lang`, yönünü `dir` ile bildir; CSS'te mantıksal özellikleri kullan.

**Yeni terimler:** Locale — dil/bölge yazım kuralları seçimi; Intl — yerel biçimlendirme ve karşılaştırma API'leri; Collator — metni dile göre karşılaştıran araç; UTF-16 — JavaScript string'lerini temsil eden kodlama biçimi; mantıksal CSS özelliği — boşluğu yazı akışının başlangıç/bitiş tarafına göre tarif eden özellik.

**Kendini yokla:** Fiyatı neden önce `₺1.234,50` metnine çevirip state'te saklamazsın?  
*Cevap:* Çünkü bu gösterim dil ve ülkeye bağlıdır; ham sayı hesaplama ve başka biçimde gösterme için gereklidir.

**Kendini yokla:** `Intl.Collator` ile `toLocaleLowerCase` neyi farklı yapar?  
*Cevap:* Collator sıralama karşılaştırmasını, locale duyarlı lowercase ise harf dönüşümünü yapar.
