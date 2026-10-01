---
title: "Şemadan tipi çıkar"
minutes: 12
kind: concept
---

# Şemadan tipi çıkar

Şema, çalışma anında bir değerin kurallara uyup uymadığını kontrol eder. TypeScript ise kodunu yazarken hangi alanları kullanabileceğini denetler. Aynı alanları hem şemada hem de ayrı bir type açıklamasında yazarsan zamanla biri değişip öteki unutulabilir. Zod'un **z.infer** özelliği, TypeScript tipini şemadan üretir.

## Önce iki alan, sonra çıkarılmış tip

Sinema'daki bir gösterim etiketi için kısa bir şema yazalım. **z.infer<typeof ...>** ifadesi şemada tarif edilen alanların TypeScript tipini çıkarır; **typeof** burada değişkenin tipini almak için kullanılır.

```ts check
import { z } from 'zod'

const screeningTagSchema = z.object({
  label: z.string(),
  featured: z.boolean(),
})
type ScreeningTag = z.infer<typeof screeningTagSchema>
```

**ScreeningTag** artık **{ label: string; featured: boolean }** ile aynı alan yapısına sahiptir. Bunu ayrıca elle yazmadık; alanları değiştirdiğinde tip de aynı şemadan yeniden çıkarılır. Bu adım bir tipi üretir, henüz hiçbir gerçek nesneyi kontrol etmez.

## Çıkarılan tipi fonksiyonda kullan

Şimdi bu tipi alan bir yardımcı fonksiyon tanımlayalım. Fonksiyon yalnızca doğrulanmış bir etiketi ekrana hazır metne çevirsin.

```ts check
import { z } from 'zod'

const screeningTagSchema = z.object({
  label: z.string(),
  featured: z.boolean(),
})
type ScreeningTag = z.infer<typeof screeningTagSchema>

function tagText(tag: ScreeningTag): string {
  return tag.featured ? '★ ' + tag.label : tag.label
}
```

TypeScript, tagText çağrısında label ve featured alanlarının var olduğunu bilir. featured alanını şemadan kaldırırsan çıkarılan tip de değişir; tagText içindeki eski alan kullanımı derleme hatasına dönüşür. Tek şema böylece çalışma zamanı kuralının ve sonraki kodun alan şeklinin ortak kaynağı olur.

Bu fonksiyonun parametre tipi, ona verilen nesnenin API'den geldiğini veya geçerli olduğunu ispatlamaz. Yalnızca TypeScript kodunda gerekli alanların bulunduğunu söyler. Dış veri için gerçek kontrolü ayrıca çağırmalısın.

## Tip çıkarımı ile parse'ı birleştir

Bir film gösterim notunun boş olmayan salon adı ve dakikayla ifade edilen başlangıç saati olsun. Bu örnekte min(1) değeri çalışma anında sınar; z.infer ise şemanın alan biçimini çıkartır.

```ts check
import { z } from 'zod'

const screeningNoteSchema = z.object({
  room: z.string().trim().min(1),
  startsAtMinute: z.number().int().positive(),
})
type ScreeningNote = z.infer<typeof screeningNoteSchema>

function readScreeningNote(raw: unknown): ScreeningNote {
  return screeningNoteSchema.parse(raw)
}

const note = readScreeningNote({ room: '  Mavi Salon  ', startsAtMinute: 90 })
console.log(note.room)
```

Çağıran taraf unknown verir; fonksiyon önce gerçek değeri parse eder, sonra ScreeningNote biçiminde döndürür. Çıktıda room boşluklardan arındırılmıştır. z.infer ile çıkarılan alan tipi yine string olur; min(1) gibi içerik koşulunu TypeScript'in string tipi tek başına taşımaz.

| Adım | Ne olur? | Sonraki kodun gördüğü |
| --- | --- | --- |
| 1 | Dış değer unknown olarak alınır | Alanlara henüz güvenilmez |
| 2 | screeningNoteSchema.parse(raw) çağrılır | Alanlar ve kurallar gerçek değer üzerinde sınanır |
| 3 | room çevresindeki boşluklar temizlenir | Çıktıda Mavi Salon bulunur |
| 4 | Parse başarılı olur | note tipi ScreeningNote olur |
| 5 | Kural tutmaz | Fonksiyon hata verir; geçersiz sonuç dönmez |

Tablo, çalışma zamanı kontrolüyle TypeScript tipinin farklı işler yaptığını gösterir. Şema boş adı reddeder; çıkarılan room: string tipi ise yalnızca bu alanın metin olduğunu belirtir. Hem doğrulama hem tip kullanımı gerekir: biri değeri kontrol eder, diğeri kontrol edilmiş çıktıyla yazdığın kodu korur.

![Bilinmeyen dış verinin doğrulamayla tipli veriye ya da hataya ayrıldığı akış](diagram:zod-sinir)

## Ayrı tip yazınca hangi risk doğar?

Aşağıdaki iki tanımı karşılaştıralım:

```ts check
import { z } from 'zod'

const screeningTagSchema = z.object({ label: z.string(), featured: z.boolean() })
type ScreeningTag = { label: string; featured?: boolean }
```

Burada elle yazılan tip featured alanını opsiyonel sayıyor, oysa şema zorunlu tutuyor. İki tanım bugün benzer görünse bile alan kuralı değişince aralarındaki farkı fark etmeyebilirsin. **type ScreeningTag = z.infer<typeof screeningTagSchema>** yazınca bu ikinci kaynak ortadan kalkar.

Bu, z.infer'in şemayı çalıştırdığı anlamına gelmez. Şöyle yazarsan dış veri hâlâ sınanmamıştır:

```ts check
import { z } from 'zod'

const screeningTagSchema = z.object({ label: z.string(), featured: z.boolean() })
type ScreeningTag = z.infer<typeof screeningTagSchema>
const raw: unknown = JSON.parse('{"label":"Gece Seansı","featured":"evet"}')
const tag = raw as ScreeningTag
console.log(tag.label)
```

**as ScreeningTag** TypeScript'e iddia verir, fakat JSON'daki featured: "evet" değerini boolean yapmaz ve şemayı çalıştırmaz. Dış veri için screeningTagSchema.parse(raw) ya da başarısızlığı ekranda ele alacağın yerde safeParse(raw) çağrısı gerekir. Parse edilmiş başarılı çıktıyı ScreeningTag kullanan fonksiyonlara aktarabilirsin.

## Gerçek bir hata ve düzeltmesi

:::mistake[z.infer'i doğrulama sanmak]
**Belirti →** TypeScript tag.featured kullanımına izin verir ama ekranda metin yerine beklenmeyen bir değer çıkar. **Neden →** Tip şemadan çıkarıldı, ancak gerçek raw değerinde şema hiç çalışmadı. **Düzeltme →** Dış veriyi önce şemayla parse et; başarılı parse sonucunu çıkarılmış tipteki fonksiyona ver.
:::

TypeScript tipleri kod değişirken sana hızlı uyarı verir; parse ise uygulama çalışırken API'nin veya kullanıcının verdiği gerçek değeri denetler. Şemadan tip çıkarmanın nedeni bu iki katmanda alan tanımını eşitlemektir, birini diğeriyle değiştirmek değil.

Bu ortak kaynağın yararı alan değişikliğinde daha net görünür. Diyelim ki gösterim etiketindeki `featured` alanını `isFeatured` diye yeniden adlandırdın. Şemayı ve çıkarılan tipi kullandığında, `tagText` içindeki eski alan kullanımı TypeScript tarafından hemen bulunur; elle yazılmış, unutulmuş bir tip ise eski adı sessizce taşımaya devam edebilir.

Çıkarılmış tipi başka fonksiyonların parametresi yapmak da aynı tutarlılığı korur. Örneğin bir kart metni oluşturan fonksiyon veya sıralama yardımcısı `ScreeningTag` alabilir. Her fonksiyona ayrı nesne tipi yazmana gerek kalmaz; alanların şekli tek yerden gelir. Yine de bu fonksiyonlara dışarıdan gelen ham nesneyi doğrudan verme: API cevabını alan yerde parse et, sonra tipli sonucu paylaş.

Şema ile tipi yan yana tuttuğunda iki farklı soruya cevap alırsın: “Bu gerçek değer kuralları geçti mi?” ve “Bu fonksiyon hangi alanları kullanabilir?” Kod incelemesinde bu ayrımı korumak, z.infer'i sihirli güvenlik etiketi gibi okumaktan kaçınmana yardım eder. Alan yapısını tekrar kullanırsın; runtime kontrolünün atlandığı durum yine görünür kalır.

## Özet

- z.infer<typeof schema> şemanın tarif ettiği alan yapısının TypeScript tipini çıkarır.
- Çıkarılan tipi parametrelerde ve parse edilmiş değerleri kullanan fonksiyonlarda kullanabilirsin.
- Tip çıkarmak gerçek bir değeri kontrol etmez; dış veri için şemayı parse et.
- string boş metni de içerir; min(1) gibi içerik koşulları parse sırasında çalışır.

**Yeni terimler:**
- z.infer: Zod şemasının TypeScript tipini türeten araç.
- typeof: Burada bir şema değişkeninin TypeScript tipini ifadeye taşıyan operatör.
- parse edilmiş çıktı: Şemadaki gerçek kontrollerden başarıyla geçmiş değer.

**Kendini yokla:** z.infer<typeof schema> tek başına API verisini kontrol eder mi?
*Cevap:* Hayır. Tipi çıkarır; gerçek değer için şemayı çalıştırmalısın.

**Kendini yokla:** min(1) kuralı çıkarılan string tipinde boş metni dışlar mı?
*Cevap:* Hayır. Bu kural parse sırasında sınanır, TypeScript'in string tipi boş metni de kapsar.
