---
title: "İlk çalışma zamanı şeması"
minutes: 13
kind: concept
---

# İlk çalışma zamanı şeması

:::pain[Problem]
TMDB film kartında `poster_path: null` gönderiyor. Kart bunu string sanıp `startsWith('/')` çağırınca patlıyor. Başlığı `null` kabul etmek de çözüm değil; bu kez eksik başlık ekranda anlamlı bir film gibi dolaşıyor.
:::

## Verinin şekline göre kural kur

Bir şema, beklediğin verinin alanlarını ve alan değerlerine ait koşulları tarif eder. Şema gerçek bir değere uygulandığında Zod çalışma anında alanları kontrol eder. Bu yüzden şema sadece TypeScript tipi değildir: `parse` veya `safeParse` çağrısı olmadan JSON'u değiştirmez ya da kontrol etmez.

:::model[Tip derlemede, veri çalışma anında]
Uzak JSON'u `unknown` olarak başlat; dış veriyi şema ile doğrulamadan kullanma. Zod'un başarılı çıktısı çalışma zamanı kanıtını taşır, TypeScript de bu çıktıyı sonraki kodda tipli tutar. Bu derste yeni olan, kanıtın hangi alan kurallarından oluştuğunu somutlaştırmaktır.
:::

![Bilinmeyen dış verinin doğrulamayla tipli veriye ya da hataya ayrıldığını gösteren akış](diagram:zod-sinir)

Bir nesne şeması kurarken şu kurallar belirleyicidir:

1. `z.object({ ... })` nesne alanlarının şemasını bir araya getirir; her alanın adı ve kabul edilen değer tipi açıkça yazılır.
2. `z.string()`, `z.number()`, `z.boolean()` ve `z.array(itemSchema)` gibi temel şemalar değer türünü kontrol eder; zincirlenen `.min()`, `.int()` veya `.positive()` gibi kurallar kabul edilen aralığı daraltır.
3. `.nullable()` açıkça `null` değerini kabul eder. `.optional()` alanın `undefined` olmasına ya da nesnede bulunmamasına izin verir. Bunlar aynı sözleşme değildir.
4. `parse(value)` geçerliyse doğrulanmış çıktıyı döndürür, değilse `ZodError` fırlatır. `safeParse(value)` ise `{ success: true, data }` veya `{ success: false, error }` döndürür.
5. Zod 4'te özel hata metnini `{ error: '...' }` seçeneğiyle ver. Yeni örneklerde eski `{ message: ... }` kullanımını kopyalama.

Bu kurallar birbirinden bağımsızdır. Örneğin `z.string().nullable()` string ve null kabul eder, ama alanın nesnede bulunmasını ister. Alanın eksik olmasına da izin vermek istiyorsan `.optional()` gerekir. Gözlediğin API sözleşmesinde ne varsa onu yaz; “ileride sorun çıkmasın” diye her alanı optional yapmak, eksik veriyi sessizce geçerli sayar.

## Poster alanını adım adım izle

```ts check
import { z } from 'zod'

const posterSchema = z.object({ path: z.string().nullable() })
const present = posterSchema.safeParse({ path: null })
const missing = posterSchema.safeParse({})
console.log(present.success, missing.success)
```

İlk nesnede `path` vardır ve değeri `null` olduğu için `present.success` doğrudur. İkinci nesnede alan yoktur; şema nullable olsa da `missing.success` yanlıştır. Önce nullable kuralını “null da string gibi” diye değil, ayrı bir değerin bilinçli kabulü olarak düşün. Poster kullanılmadığında API gerçekten null gönderiyorsa bu değer domain'in parçasıdır.

| Girdi | Alan durumu | Şemanın kararı |
| --- | --- | --- |
| `{ path: '/a.jpg' }` | alan var, string | başarılı |
| `{ path: null }` | alan var, null | `.nullable()` varsa başarılı |
| `{}` | alan eksik | zorunlu şemada başarısız |
| `{ path: 4 }` | alan var, sayı | başarısız |

Adım adım parse sırasında Zod önce değerin nesne olup olmadığını, sonra `path` alanının varlığını ve türünü kontrol eder. Tür string ise ek string koşullarını yürütür; nullable ise `null` dalını kabul eder. Bir kontrolde başarısız olursa başarılı çıktı olarak kullanabileceğin `data` oluşmaz. `safeParse` sonucu bu iki yolu `success` alanıyla ayırır ve TypeScript koşulun içinde doğru dalı daraltır.

## Başlık ve poster aynı kurala sahip değil

Film başlığı kullanıcıya gösterilecek metindir; boş başlık kartta işe yaramaz. Poster ise TMDB'de null olabilir. Aynı nesne şemasında bu alanlara farklı kurallar vermek doğaldır:

```ts check
import { z } from 'zod'

const catalogEntrySchema = z.object({
  id: z.number().int().positive(),
  title: z.string().min(1, { error: 'Başlık gerekli' }),
  posterPath: z.string().nullable(),
})
const result = catalogEntrySchema.safeParse({
  id: 12,
  title: 'Uzak İstasyon',
  posterPath: null,
})
if (result.success) console.log(result.data.title)
```

Burada boş başlık da reddedilir; yalnızca string olma koşulu yeterli sayılmaz. `min(1)` uzunluğu denetler, fakat boşluklardan oluşan metni tek başına anlamlı içerik yapmaz. İnsan tarafından girilen bir ad için `.trim().min(1)` kullanmak, başındaki/sonundaki boşlukları çıktıda temizler ve boş sonucu reddeder. API alanında trim dönüşümü yapmadan önce sunucunun alanı değiştirmeyi bekleyip beklemediğini düşün; doğrulama ile normalize etme aynı karar değildir.

Başarılı `safeParse` sonucunun `.data` alanı yalnızca doğrulanmış değerdir. Başarısız sonuçtaki `.error` ise hangi kuralların tutmadığını taşır. Kart tek başına bir poster bozukluğunda yedek görsel seçebilir; endpoint'in bütün verisi sözleşme dışıysa API client hatayı yukarı taşımalıdır. Kullanıcıya hangi UX'in gösterileceği, parse kararından sonraki ayrı bir ürün kararıdır.

Şemayı yazmak ile onu uygulamak arasındaki farkı koru. Örneğin `const catalogEntrySchema = ...` tanımı hiçbir veriyi parse etmez. Her veri girişinde uygun biçimde `schema.parse(raw)` veya `schema.safeParse(raw)` çağrılmalıdır. İki çağrıyı da aynı JSON üzerinde çalıştırmaya gerek yoktur; tek sınırda bir kez doğrula ve o sonucu aktar.

Bir alanı nullable yapmak aynı zamanda sonraki kodun null dalını ele almasını gerektirir. Şema posterPath için string veya null çıktısı veriyorsa render sırasında koşullu görsel URL'i üretmeli veya placeholder seçmelisin. Şemada null'a izin verip bileşende hiç kontrol etmemek, doğrulamayı doğru ama kullanımı yine kırılabilir bırakır. Şemanın garantisi “alan null ya da string”dir; “alan her zaman görsel URL'i olur” değildir.

Boş string ile null da ayrı anlamlar taşır. API bir posteri bilerek null gönderiyorsa bu değer alanın boş olduğunu açıkça anlatır. Formda kullanıcı henüz bir şey yazmadıysa HTML çoğunlukla boş string gönderir. Bir alan için min(1) kullanmak boş metni reddeder, nullable kullanmak null'ı kabul eder. Bu iki kuralı tek bir “boş değer” kavramında birleştirme; upstream kaynağın hangisini ürettiğini incele.

Parse sonucunu kullanırken hata yolunu da bağlama göre seç. parse ile sınır fonksiyonu fail fast olabilir ve hatayı query katmanına taşır. safeParse ile kart, geçersiz opsiyonel içeriğe yedek görünüm verebilir. Her iki API de aynı şemayı çalıştırır; fark, beklenen başarısızlığın exception mı yoksa dallanabilir bir sonuç mu olacağıdır. Seçim kodun sorumluluğunu daha açık kılmalıdır.

## Sık yanılgılar

:::mistake[Optional ile nullable'ı eş tutmak]
**Belirti →** Gerçek `null` poster cevabı reddedilir ya da alanın tamamen eksik olduğu veri kabul edilir. **Neden →** `.optional()` ile `.nullable()` farklı durumları temsil eder. **Düzeltme →** Null gerçek değer ise `.nullable()`, alanın yokluğu da geçerliyse ayrıca `.optional()` kullan.
:::

:::mistake[Her alanı gevşetmek]
**Belirti →** Başlıksız film kayıtları da normal kart gibi ekrana ulaşır. **Neden →** Alanlar gereğinden fazla optional yapıldı. **Düzeltme →** Yalnızca API'de gerçekten eksik veya null olabilen alanlara izin ver; zorunlu alanları zorunlu tut.
:::

:::mistake[Şema tanımını doğrulama sanmak]
**Belirti →** Şema dosyası vardır ama ham JSON hatalı halde ekranda görünür. **Neden →** Değer hiçbir zaman `parse` edilmedi. **Düzeltme →** JSON'u sınırda şemaya ver ve yalnızca başarılı parse sonucunu döndür.
:::

:::sector
Ekipler endpoint şemalarını gerçek cevap örnekleriyle birlikte gözden geçirir. Null olabilen alanın nedeni ve zorunlu alanların listesi PR açıklamasında belirgin tutulur. Bu yaklaşım, UI geliştiricisinin her alan için kendi tahminini üretmesini önler ve API değiştiğinde hangi sözleşmenin bozulduğunu daraltır.
:::

## Özet

- Zod şeması çalışma zamanında gerçek değeri sınar; yalnızca tanım yapmak yetmez.
- `.nullable()` null'ı, `.optional()` eksik/undefined değeri kapsar.
- `parse` hata fırlatır; `safeParse` sonucu iki kola ayırır.
- Alan kurallarını API'deki gerçek sözleşmeye göre ayrı ayrı belirle.

**Kendini yokla:** `z.string().nullable()` alanı nesnede eksik olduğunda kabul eder mi?  
*Cevap:* Hayır. Null değer kabul edilir; eksik alan için optional kuralı gerekir.

**Kendini yokla:** Bir şema değişkeni tanımlamak veriyi kontrol eder mi?  
*Cevap:* Hayır. Değer üzerinde `parse` veya `safeParse` çağrısı gerekir.
