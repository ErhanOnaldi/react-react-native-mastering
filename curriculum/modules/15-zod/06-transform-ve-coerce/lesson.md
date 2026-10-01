---
title: "URL stringini güvenli sayıya çevir"
minutes: 15
kind: concept
---

# URL'den gelen metni uygulama değerine çevir

Sinema film listesinin adresinde `?page=3` varsa, `URLSearchParams` sana metin olarak `'3'` verir. Ekrandaki liste ise sayıyla sayfa seçmek ister. Metni sayıya çevirmek başlangıçtır; çıkan sayının gerçekten kullanılabilir olup olmadığını ayrıca kontrol etmelisin.

## Dönüşüm tek başına yetmez

Zod'da **coercion**, gelen değeri başka bir türe çevirmeyi denemektir. `z.coerce.number()` JavaScript'in `Number(...)` davranışına benzer: `'3'` sayıya, `'abc'` ise `NaN` değerine dönüşür. Bu ilk küçük adımda yalnızca dönüşümü görelim:

```ts check
import { z } from 'zod'

const pageNumber = z.coerce.number()
const result = pageNumber.safeParse('3')
if (result.success) console.log(result.data + 1)
```

`safeParse` başarılı olduğunda `result.data` artık number'dır ve `+ 1` toplama yapar. Ama bu şema `'0'` değerini de kabul eder. Dönüşüm, sayfa numarasının 1 veya daha büyük olması gerektiğini bilmez.

Şimdi dönüşümden sonra iki kural daha ekleyelim: sayfa tam sayı ve en az 1 olmalı.

```ts check
import { z } from 'zod'

const pageNumber = z.coerce.number().int().min(1)
const values = ['3', '1.5', '0', 'abc']
for (const value of values) {
  const result = pageNumber.safeParse(value)
  console.log(value, result.success ? result.data : 'geçersiz')
}
```

`'3'` sayıya dönüşür ve iki kuralı da geçer. `'1.5'` number olur ama tam sayı değildir; `'0'` tam sayıdır ama alt sınırın altındadır. `'abc'` ise geçerli bir sayı oluşturamaz. Bu yüzden her dönüşümün ardından iş kuralını açıkça yazıyoruz.

## Ham biçim ve çıkan biçim

Bir şema veriyi alırkenki biçimle başarılı parse sonrasındaki biçimi ayırabilir. `z.input<typeof schema>`, şemaya verdiğin değerin tipidir; `z.output<typeof schema>`, parse başarılı olunca aldığın değerin tipidir. Bu iki tip farklıysa dönüşüm sınırı da tiplerde görünür.

```ts check
import { z } from 'zod'

const pageNumber = z.coerce.number().int().min(1)
type PageInput = z.input<typeof pageNumber>
type PageOutput = z.output<typeof pageNumber>

const raw: PageInput = '4'
const parsed = pageNumber.parse(raw)
const page: PageOutput = parsed
console.log(page + 1)
```

Coercion şemasının ham input tipi Zod 4'te `unknown` olabilir; çünkü coercion farklı türlerden değer alabilir. Buradaki uygulama URL'den geldiğini bildiği için gerçek değer metindir. Parse başarılı olduğunda çıktı `number` olur. `z.infer<typeof pageNumber>` çıktı tipini verir; ham ve çıktı tiplerini ayrı belirtmek istediğinde `z.input` ile `z.output` adları daha açıklayıcıdır.

Bu tipler editördeki TypeScript kontrolüne yardım eder; gelen değeri çalışma anında değiştirmezler. Dönüşümü gerçekten yapan çağrı `parse` ya da `safeParse`'tır. Mesela bir değişkene `PageOutput` tipini yazmak, `'abc'` metnini number'a çevirmiş olmaz. Önce şemayı çalıştırır, başarı sonucundaki `data` değerini kullanırsın.

![Bilinmeyen dış verinin dönüşüm ve doğrulamayla tipli veriye ya da hataya ayrıldığı akış](diagram:zod-sinir)

URL'de parametre bulunmayınca `params.get('page')` değeri `null` olur. Uygulama ilk sayfayı varsayılan sayacaksa, şemaya vermeden önce bu eksik değeri `'1'` olarak yorumlayabilir. Dönüşüm ve kontrollerden sonra kalan kararı ise sen verirsin:

```ts check
import { z } from 'zod'

const pageNumber = z.coerce.number().int().min(1)
function parsePage(raw: string | null): number {
  const result = pageNumber.safeParse(raw ?? '1')
  return result.success ? result.data : 1
}

console.log(parsePage('2'), parsePage('0'), parsePage(null))
```

Bu fonksiyon `2`, `1` ve `1` yazar. Eksik parametreyi ilk sayfaya çevirme de geçersiz sayfayı ilk sayfaya düşürme de açık ürün kararlarıdır. Başka bir ekranda hatalı adresi kullanıcıya göstermek isteyebilirsin. Önemli olan `NaN` değerini sayfa isteğine veya dizi indeksine taşımamaktır.

| Ham değer | Dönüşüm | Kontrol | Uygulama kararı |
| --- | --- | --- | --- |
| `'3'` | `3` | tam sayı ve `>= 1` | 3. sayfayı aç |
| `'1.5'` | `1.5` | tam sayı değil | ilk sayfayı aç |
| `'0'` | `0` | alt sınırın altında | ilk sayfayı aç |
| `'abc'` | sayı oluşmaz | parse başarısız | ilk sayfayı aç |
| `null` | şemaya `'1'` gönderilir | tam sayı ve `>= 1` | 1. sayfayı aç |

## Metin olarak gelen boolean

Şimdi URL'deki `?archived=false` değerine bakalım. `Boolean('false')` sonucu `true` olur; çünkü JavaScript koşulda boş olmayan metinleri doğru kabul eder. `z.stringbool()` ise metnin anlamına göre boolean üretir:

```ts check
import { z } from 'zod'

const archivedFlag = z.stringbool()
console.log(Boolean('false'))
console.log(archivedFlag.parse('false'))
console.log(archivedFlag.parse('true'))
```

Çıktılar sırasıyla `true`, `false`, `true` olur. İlk satır metnin boş olup olmadığına bakar; `stringbool` metni bilinen boolean sözcüğü olarak yorumlar. Şemanın kabul etmediği başka bir ifade gelirse `parse` hata verir; uygulama `safeParse` ile bunu yakalayıp hangi davranışın uygun olduğuna karar verebilir.

`z.stringbool()` true/false yanında `1`/`0` gibi metinleri de tanır. URL'de parametre yoksa `null` değerini önce istediğin metinsel varsayılana çevirirsin; örneğin arşiv filtresinin kapalı olması için `'false'`. Yokluk ve geçersiz metin aynı durum değildir: biri varsayılan olabilir, diğeri hata veya kontrollü varsayılan gerektirebilir.

## Küçük bir dönüşüm daha

Her dönüşüm sayı coercion'ı olmak zorunda değil. Örneğin URL'den gelen arama terimini kullanmadan önce kenar boşluklarını temizleyip büyük harfe çevirebilirsin. `.transform(...)`, şemadan geçen değeri yeni bir değere dönüştürür:

```ts check
import { z } from 'zod'

const searchTerm = z.string().trim().transform((value) => value.toUpperCase())
const result = searchTerm.parse('  dune  ')
console.log(result)
```

Önce `trim()` boşlukları kaldırır; sonra transform temiz metni alıp `DUNE` üretir. Sıra önemlidir, çünkü sonraki işlem önceki adımın değerini görür. Arama terimini boş bırakmayı yasaklamak isteseydin, boşluk temizlendikten sonra `.min(1)` de eklerdin.

## Sık yapılan hatalar

:::mistake[Çevrilen her değeri geçerli sanmak]
Belirti → `page=0` ile anlamsız bir sayfa açılır. Neden → String sayıya çevrildi ama pozitif tam sayı kuralı eklenmedi. Düzeltme → `.int().min(1)` gibi sınırları dönüşümün arkasına koy.
:::

:::mistake[Boolean ile metnin anlamını okumaya çalışmak]
Belirti → `archived=false` iken arşiv filtresi açık olur. Neden → `Boolean` boş olmayan `'false'` metnini `true` sayar. Düzeltme → Metinsel bayrak için `z.stringbool()` kullan.
:::

:::mistake[Input ile output'u aynı tip sanmak]
Belirti → Ham form değeri veya URL metni number gibi kullanılır. Neden → Dönüşüm öncesi ve sonrası değerlerin tipi farklıdır. Düzeltme → Ham değer için `z.input`, parse edilmiş değer için `z.output` tipine bak.
:::

## Zihinde tut

- `z.coerce.number()` değeri number'a çevirmeyi dener; `.int()`, `.min()` gibi kurallar uygunluğu denetler.
- `z.stringbool()` metinsel boolean değerini JavaScript'in truthiness kuralından ayrı yorumlar.
- `z.input` şemaya verilen biçimi, `z.output` başarılı parse'ın ürettiği biçimi anlatır.
- Eksik değer ve geçersiz değer için uygulanacak varsayılan ürün kararıdır; bunu kodda açıkça göster.

**Yeni terimler:**

- **coercion:** Girdiyi başka bir türe çevirme denemesi; ardından iş kurallarını yine doğrulamak gerekir.
- **input:** Şemanın parse öncesinde beklediği değer tipi.
- **output:** Şema başarılı parse ettikten sonra döndürdüğü değer tipi.
- **transform:** Geçerli değeri başka bir değere dönüştüren Zod adımı; sonraki kontroller önceki adımın sonucunu görür.

**Kendini yokla:** `'abc'` neden sayfa numarası olamaz?  
*Cevap:* Sayıya dönüştürülemez; ayrıca pozitif tam sayı şartını da sağlayamaz.

**Kendini yokla:** `Boolean('false')` ve `z.stringbool().parse('false')` ne döndürür?  
*Cevap:* İlki `true`, ikincisi `false` döndürür.
