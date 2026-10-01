---
title: "Veriye uygun şema kur"
minutes: 14
kind: concept
---

# Veriye uygun şema kur

Sinema'da bir fragman kartı, API'den gelen filmin süresini ve türlerini gösteriyor. JavaScript nesnesini \`console.log\` ile inceleyebilirsin; ama log'a bakmak, sonraki cevabın da aynı biçimde geleceğini garanti etmez. Bir **şema**, verinin hangi alanlardan oluştuğunu ve her alanın hangi değerlere izin verdiğini tarif eder. Zod bu tarifi gerçek değere uygulayarak kontrol eder.

## Önce tek alanı sınayalım

Bir fragmanın süresi sayı olmalı. Zod'daki \`z.number()\` sayısal değeri kabul eden temel bir şemadır; \`.parse()\` ise bu şemayı gerçek değere uygular.

```ts check
import { z } from 'zod'

const runtimeSchema = z.number()
const runtime = runtimeSchema.parse(124)
console.log(runtime)
```

\`124\` sayı olduğu için \`parse\` aynı değeri döndürür. Burada yalnızca tek alanı kontrol ettik; \`"124"\` metni sayı gibi görünse de otomatik olarak kabul edilmez. Kontrol, değişken adına ya da niyetimize değil, gelen gerçek değere bakar.

## Sayıya iş kuralı ekleyelim

Fragman süresinin sayı olmasının yanında pozitif bir tam sayı olması gerekiyor. Önceki şemaya iki koşul ekliyoruz: \`.int()\` kesirli sayıları, \`.positive()\` sıfır ve negatif sayıları reddeder.

```ts check
import { z } from 'zod'

const runtimeSchema = z.number().int().positive()
const valid = runtimeSchema.safeParse(124)
const invalid = runtimeSchema.safeParse(0)
console.log(valid.success, invalid.success)
```

İlk değer hem tam sayı hem pozitif olduğu için geçer; \`0\` ise tam sayı olsa da pozitif değildir. \`.safeParse()\` başarısızlıkta exception fırlatmak yerine sonucu \`success\` alanıyla ayırır. Böylece beklenen bir geçersiz değerde kodun iki yolu açıkça ele alması mümkün olur.

\`parse\` ve \`safeParse\` aynı şemayı çalıştırır. \`parse\`, geçerli değeri döndürür ve geçersizde hata fırlatır; \`safeParse\`, başarılı veya başarısız sonucu nesne olarak verir. Sınır fonksiyonunun hata üretmesi uygun olduğunda \`parse\` okunaklıdır; alternatif görünüm seçmek istediğinde \`safeParse\` ile dallanabilirsin.

## Gerçek film verisine büyütelim

Artık birden çok alanı tek tarifte birleştirelim. Tür adları metinlerden oluşur; fragman süresi de pozitif tam sayıdır. Bu, az önceki sayı kuralını bir nesne şemasında tekrar kullanır.

```ts check
import { z } from 'zod'

const trailerSchema = z.object({
  runtimeMinutes: z.number().int().positive(),
  genres: z.array(z.string()),
})

const trailer = trailerSchema.parse({
  runtimeMinutes: 124,
  genres: ['Bilim Kurgu', 'Macera'],
})
console.log(trailer.genres[0])
```

\`z.object()\` her alanın kendi şemasını kullanarak nesneyi denetler; \`z.array(z.string())\` ise dizinin içindeki her elemanın da metin olmasını ister. Nesne geçerliyse \`trailer\` doğrulanmış çıktı olarak kullanılır. \`genres: ['Macera', 8]\` olsaydı bütün nesne reddedilirdi; ilk elemanın doğru olması ikinci elemanın yanlışlığını örtmez.

Dış servisin API'sine veya uygulamanın veri kaynağına **upstream** denir; bu örnekte TMDB upstream kaynaktır. Şemadaki kurallar, bu kaynağın gerçekten gönderdiği veriye dayanmalı. Servis tür alanını sayı gönderiyorsa string beklemek uygulamanın verisini doğrulamaz, yalnızca gerçek sözleşmeyle uyuşmaz.

## Alanın yokluğu ile null aynı değil

Bir alanın bazen \`null\` geldiğini düşün. \`null\`, alanın mevcut olduğu fakat bilerek boş olduğu anlamına gelir. \`.nullable()\` bu değeri kabul eder; \`.optional()\` ise alanın gelmemesine izin verir. Hangi duruma izin vereceğin API'nin alan sözleşmesine bağlıdır.

```ts check
import { z } from 'zod'

const trailerSchema = z.object({
  runtimeMinutes: z.number().int().positive(),
  genres: z.array(z.string()),
  teaserPath: z.string().nullable(),
})

const result = trailerSchema.safeParse({
  runtimeMinutes: 124,
  genres: ['Bilim Kurgu'],
  teaserPath: null,
})
console.log(result.success)
```

\`teaserPath\` alanı nesnede var ve değeri \`null\` olduğu için bu veri kabul edilir. Alanı tamamen çıkarırsan başarısız olur; nullable yapmak alanı optional yapmaz. Bu fark önemlidir, çünkü eksik bir API alanı servis sözleşmesinin değiştiğini gösterebilirken \`null\` beklenen “fragman yok” durumunu anlatabilir.

| Girdi | Şema alanı | Sonuç | Neden? |
| --- | --- | --- | --- |
| \`teaserPath: '/clip.mp4'\` | \`z.string().nullable()\` | kabul | Değer string |
| \`teaserPath: null\` | \`z.string().nullable()\` | kabul | Null açıkça izinli |
| \`teaserPath\` yok | \`z.string().nullable()\` | ret | Alan zorunlu |
| \`teaserPath\` yok | \`z.string().optional()\` | kabul | Alanın yokluğu izinli |

Bu tabloda aynı türde görünen üç durumun farklı karar verdiğini görüyorsun. Şema “genel olarak boş olabilir” demez; string, null ve yokluk için hangi durumların geçerli olduğunu ayrı ayrı tarif eder.

## Hata hangi noktada çıkar?

Zod önce üst değerin nesne olup olmadığını, sonra nesnenin alanlarını ve her alanın alt kurallarını kontrol eder. Bu sıra, yanlış alanı daha UI'a ulaşmadan yakalar.

| Adım | İşlem | Sonuç |
| --- | --- | --- |
| 1 | Ham cevap şemaya verilir | Henüz geçerli olduğu varsayılmaz |
| 2 | \`runtimeMinutes\` sayı mı diye bakılır | Tip yanlışsa alan reddedilir |
| 3 | Sayı tam ve pozitif mi diye bakılır | Koşullar tutarsa devam edilir |
| 4 | \`genres\` dizi ve elemanları string mi diye bakılır | Bir eleman bile yanlışsa nesne reddedilir |
| 5 | Tüm kontroller geçerse \`data\` kullanılır | Çıktı şemanın tarif ettiği biçimdedir |

\`safeParse\` sonucu \`success: true\` ise doğrulanmış değer \`data\` içindedir. Başarısızsa \`error\` alanı kontrol bilgisi taşır; başarısız nesneyi başarılı veri gibi kullanmamalısın. Zod doğrulaması uygulama çalışırken gerçekleşir, TypeScript ise bu sonucun alanlarını kod içinde doğru kullanmana yardım eder.

![Bilinmeyen dış verinin parse ile tipli veriye ya da hataya ayrıldığı akış](diagram:zod-sinir)

## Öğrencinin sık düşeceği tuzak

:::mistake[Nullable alanı optional sanmak]
**Belirti →** API \`teaserPath\` alanını hiç göndermediğinde beklediğin kabul gerçekleşmez. **Neden →** \`.nullable()\` yalnızca açık \`null\` değerini kabul eder, eksik alanı değil. **Düzeltme →** Kaynakta alan gerçekten eksik gelebiliyorsa \`.optional()\` kuralını da ekle; değilse alanı zorunlu bırak.
:::

:::mistake[Şema tanımının veriyi kontrol ettiğini sanmak]
**Belirti →** Şema kodda durur ama yanlış cevap karta kadar ulaşır. **Neden →** Şema ancak \`parse\` veya \`safeParse\` çağrıldığında çalışır. **Düzeltme →** Gerçek cevabı veri uygulamaya girerken şemaya ver.
:::

## Özet

- Şema, beklenen alanları ve alan değerlerinin kurallarını tarif eder.
- \`parse\` geçerliyse veriyi döndürür, değilse hata üretir; \`safeParse\` sonucu dallandırır.
- \`.nullable()\` açık \`null\` değerini, \`.optional()\` eksik alanı kabul eder.
- Dizideki her eleman ve nesnedeki her alan kendi kuralını geçmelidir.

**Yeni terimler:**
- şema: Bir verinin alanlarını ve kabul edilen değerlerini tarif eden çalışma zamanı kuralı.
- \`parse\`: Şemayı gerçek veriye uygulayıp geçerliyse doğrulanmış çıktıyı döndüren çağrı.
- \`safeParse\`: Başarıyı veya hatayı \`success\` alanıyla bildiren parse çağrısı.
- upstream: Veriyi uygulamana gönderen kaynak veya servis.

**Kendini yokla:** \`.nullable()\` alanın nesnede hiç bulunmamasına izin verir mi?
*Cevap:* Hayır. \`null\` değerini kabul eder; eksik alan için \`.optional()\` gerekir.

**Kendini yokla:** Bir şema tanımlamak, gelen cevabı kendiliğinden denetler mi?
*Cevap:* Hayır. Gerçek değerde \`parse\` veya \`safeParse\` çağrısı yapmalısın.
