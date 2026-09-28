---
title: "Şemadan tip çıkar"
minutes: 13
kind: concept
---

# Şemadan tip çıkar

:::pain[Problem]
İzleme listesi formunda name artık zorunlu, ama ayrı yazılmış WatchlistValues içinde opsiyonel kalmış. Form hata göstermiyor; kayıt fonksiyonu da formun göndermeyeceği bir değeri bekliyor.
:::

## Kural ile tipi aynı yerden üret

Şema çalışma zamanında veriyi kontrol eder. TypeScript tipi ise derleme sırasında uygulama kodunun hangi alanları kullanabileceğini belirler. Bu iki tarif ayrı ayrı yazılırsa biri değişip diğeri eski kalabilir. Zod, şemadan doğrulanmış çıktının tipini çıkarmana izin verir: z.infer<typeof schema>.

:::model[Tip derlemede, veri çalışma anında]
Şemaya gelen dış değer parse edilene kadar bilinmez. Parse başarılı olunca data hem çalışma zamanı kontrolünden geçmiştir hem de TypeScript'in kullanacağı bir tipe sahiptir. z.infer yalnızca bu başarılı çıktının tipini çıkarır; kendi başına hiçbir değeri denetlemez.
:::

![Bilinmeyen dış verinin doğrulamayla tipli veriye ya da hataya ayrıldığını gösteren akış](diagram:zod-sinir)

Şema ve tip ilişkisini okurken bu kesin kuralları kullan:

1. z.infer<typeof schema> şemanın çıktı tipidir; typeof ile şema değişkeninin türünü alıp infer'e verirsin.
2. Parse başarılı olduğunda result.data bu çıktı tipine sahiptir. result.error yalnızca başarısız kolda bulunur.
3. Dönüşüm içermeyen şemada z.input<typeof schema> ile z.output<typeof schema> çoğunlukla aynıdır.
4. .trim(), .transform() veya z.coerce gibi işlemler girdi biçimini çıktıdan ayırabilir. Form ham girdiyi tutarken submit fonksiyonu dönüştürülmüş çıktıyı alabilir.
5. Bir TypeScript tipi, şemadaki çalışma zamanı koşullarını kodlamaz. Örneğin string boş metin değerini de içerir; .min(1) kuralı parse sırasında çalışır.

Bu kurallar tipleri hangi katmanda kullanacağını açıklar. Formun register ettiği değerler kullanıcının yazdığı biçimde durabilir. Geçerli değer için trim uygulanıp sayıya dönüştürülebilir. Dolayısıyla “formun tipi” tek bir şey değildir: form elemanının kabul ettiği ham değer ile iş kuralından geçen submit değeri farklıysa ikisini ayırmak gerekir.

## parse sonrasında değer nasıl daralır?

İzleme listesi adı string, görünürlük ise boolean olmalı. Şema ve tip şöyle bağlanır:

```ts check
import { z } from 'zod'

const listSchema = z.object({
  name: z.string().trim().min(1),
  isPublic: z.boolean(),
})
type ListValues = z.infer<typeof listSchema>

function makeList(raw: unknown): ListValues {
  return listSchema.parse(raw)
}
const list = makeList({ name: '  Akşam Filmleri  ', isPublic: false })
console.log(list.name)
```

Fonksiyonun dışındaki çağıran unknown verir. parse çalışırken nesne ve iki alan doğrulanır; name kırpılır. Fonksiyon başarılıysa çıktı ListValues tipindedir. Şemada isPublic alanını kaldırırsan çıkarılan tip de değişir ve kullanan kodda eski alana erişim derleme hatası verir.

| Adım | Değer / tip | Sonraki katmanın görebildiği |
| --- | --- | --- |
| 1. Ham değer alınır | unknown | Hiçbir alan güvenilir değil |
| 2. listSchema.parse(raw) çağrılır | Gerçek nesne kontrol edilir | Hata varsa fonksiyon dönmez |
| 3. name trimlenir | '  Akşam Filmleri  ' → 'Akşam Filmleri' | Dönüşüm uygulanmış çıktı |
| 4. ListValues döner | { name: string; isPublic: boolean } | Alanlar tipli biçimde kullanılabilir |

Tablodaki son satır boş metni yasaklamaz. ListValues['name'] hâlâ string olur. "".length > 0 gibi bir kuralı derleyici tipinin otomatik taşımasını bekleme; bu kural ancak parse sırasında sınanır. Tam da bu nedenle tipi şemadan çıkarmak ile gerçek veriyi parse etmek birbirinin alternatifi değil, aynı akışın iki adımıdır.

## İki ayrı kaynak neden sürüklenir?

Şemayı ve interface'i elle yazdığını düşün:

```ts
type ListValues = { name?: string; isPublic: boolean }
const listSchema = z.object({ name: z.string().min(1), isPublic: z.boolean() })
```

Burada TypeScript name alanının eksik olmasına izin verirken Zod bunu reddeder. İki kaynak ilk gün benzer görünebilir; iş kuralı değişince birini güncelleyip diğerini atlamak kolaydır. Ayrı tipi kaldırıp type ListValues = z.infer<typeof listSchema> dediğinde aynı şema değişikliği her iki katmana yayılır.

z.infer kısa ve doğru seçimdir, ama adı doğrulama değildir. Şu kullanımda tip çıkarılmış olsa da raw hâlâ parse edilmemiştir:

```ts
const raw: unknown = getData()
const values = raw as ListValues
```

Bir assertion, unknown değerini dış kaynakta denetim yapmadan ListValues gibi göstermiş olur. Güvenli sınır listSchema.parse(raw) veya bir hata UX'i gerektiğinde safeParse(raw) çağrısıdır. Şemadan türeyen tipi parse edilmiş veriyi alan fonksiyonlarda, kayıt tipinde ve submit callback'inde kullan.

Input ve output farkı küçük bir trim'de bile faydalı olabilir. String alanı formda boşluklarla tutulur; schema .trim() çağrısında başarılı değer kırpılmış olur. İki taraf da TypeScript açısından string olsa da veri içeriği farklıdır. Sayı coercion'ında fark daha görünürdür: form input'u string, submit değeri number olur. Bir sonraki dönüşüm katmanında z.input ve z.output bu ayrımı açıkça adlandırır.

Bir callback'in tipi, sonraki katmana ne tür değer alacağı konusunda söz verir. Şema output tipi oluştururken z.infer bu sözün kısa adıdır. Bu nedenle fonksiyon imzası için çıkarılmış tipi kullanmak işe yarar; fakat fonksiyona gelen değerin gerçekten o tipte olduğunu ispatlamaz. Dışarıdan unknown alan createList fonksiyonu önce parse yapmalı, ancak sonra ListValues döndürmelidir.

Şemalar çalışma zamanında hata üretebildiği için tip çıkarımı iki yanlış beklentiyi çözmez. z.infer içine name: string yazılması, trim sonrası boş değerin kabul edilip edilmeyeceğini söylemez. Ayrıca tip üretmek, ham API verisindeki ilave key'lerin nasıl ele alınacağını tek başına belirlemez; bu şema davranışıdır. Compile-time imzayı ve runtime parse politikasını ayrı ayrı okuyabilmelisin.

Şemadan tip çıkarmak düzenleme sırasında refactor'ı da güvenli kılar. Alanı yeniden adlandırınca parse sonrası o alanı kullanan kod derleyici uyarısı alır; şemayı çağıran sınır testleri ise eksik alanın çalışma anında reddedildiğini doğrular. İki çeşit geri bildirim farklı hataları yakalar. Tip kontrolü kullanan kodu, parse ise gerçek girdi örneklerini sınar.

## Sık yanılgılar

:::mistake[z.infer'i çalışma zamanı filtresi sanmak]
Belirti → Bozuk API nesnesi fonksiyona girer ve alan okumasında çöker. Neden → Tip çıkarıldı ama hiçbir parse çağrısı yapılmadı. Düzeltme → Dış değeri şemayla parse et; başarılı çıktıyı z.infer tipindeki fonksiyona geçir.
:::

:::mistake[String tipinin boş değeri engellediğini sanmak]
Belirti → Boş liste adı TypeScript'ten geçip kayda ulaşır. Neden → string boş metni de kapsar. Düzeltme → .trim().min(1) gibi çalışma zamanı kuralını şemada tanımla.
:::

:::mistake[Input ve output'u tek tipte zorlamak]
Belirti → Sayı bekleyen submit handler string alıyor veya RHF generic hatası çıkıyor. Neden → Coercion öncesi ve sonrası tip aynı varsayıldı. Düzeltme → Ham form alanı için z.input, dönüştürülmüş değer için z.output kullan.
:::

:::sector
Ekipler şemayı, formun ham değer tipini ve API'ye giden parse edilmiş tipi aynı modülde dışa aktarır. Bu, alan kuralı değiştiğinde üç ayrı interface aramayı önler. Yine de infer tipinin “geçerli içerik” garantisi vermediği code review'da açıkça tutulur; garanti, parse edilmiş değer için vardır.
:::

## Özet

- z.infer<typeof schema> şemanın doğrulanmış çıktı tipidir.
- Dış değer ancak parse çağrısı gerçekten çalıştıktan sonra doğrulanmış olur.
- string tipi boş metni yasaklamaz; içerik kuralı çalışma zamanında kalır.
- Dönüşüm varsa ham form girdisi ve submit çıktısı için z.input/z.output ayır.

**Kendini yokla:** z.infer tek başına unknown bir cevabı güvenli yapar mı?  
*Cevap:* Hayır. Şema parse edilmelidir.

**Kendini yokla:** .trim() uygulanmış string şemasında formun ham değeri ve parse çıktısı neden farklı olabilir?  
*Cevap:* Form boşlukları tutar; başarılı çıktı trimlenmiş string içerir.
