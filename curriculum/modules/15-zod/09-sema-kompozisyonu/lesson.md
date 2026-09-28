---
title: "Omit merdiveninin şema basamağı"
minutes: 8
kind: review
---

# Omit merdiveninin şema basamağı

:::pain[Problem]
Kaydedilmiş koleksiyonun id ve createdAt alanları var; yeni koleksiyon formunda bu değerleri kullanıcıdan istemek istemiyorsun. Alanları üç şemada tekrar yazınca isim doğrulama kuralı yalnızca ikisinde kalıyor.
:::

## TypeScript'ten çalışma zamanı şemasına

TypeScript'in Omit, Pick ve Partial utility tipleri derleme sırasında şekli değiştirir; JavaScript'te çalışan parse kuralı oluşturmaz. Zod nesne şemalarında aynı isimli omit, pick ve extend işlemleri çalışma zamanı şeması döndürür. Şema yine gerçek veriye uygulanır; türetilen her şema kendi parse davranışını taşır.

:::model[Tip derlemede, veri çalışma anında]
Tip türetimi derleyiciye yapı söyler; Zod şeması gerçek girdiyi kontrol eder. Bu derste aynı veri sözleşmesinin farklı kullanım yüzeylerini, alan kurallarını kopyalamadan çalışma zamanı için türetiyorsun.
:::

![Bilinmeyen dış verinin doğrulamayla tipli veriye ya da hataya ayrıldığını gösteren akış](diagram:zod-sinir)

Kompozisyon kararlarını şöyle oku:

1. Tam kayıt şeması saklanan nesnenin bütün alanlarını ve kurallarını taşır.
2. omit işlemi, verilen alanları çalışma zamanı doğrulamasından çıkaran yeni şema oluşturur.
3. pick küçük bir görünümde yalnız seçilen alanları doğrular ve çıktıya alır.
4. extend temel nesneye başka bağlam için alan ekler.
5. Türetilmiş şema temel alanın kurallarını taşır; ad koşulunu her birinde tekrar tanımlamazsın.

## Aynı temel şemadan üç kullanım

Bir tarif kataloğunda tam tarifte id, adı, kişisel not ve paylaşım durumu var. Yeni tarif formu id göndermez; kart başlığı yalnızca adı gösterir; paylaşılabilir tarifte URL de gerekir. Tam şemadan türeterek bu farkları ifade edebilirsin:

```ts check
import { z } from 'zod'

const recipeSchema = z.object({
  id: z.string(),
  title: z.string().trim().min(1),
  note: z.string(),
  isPublic: z.boolean(),
})
const newRecipeSchema = recipeSchema.omit({ id: true })
const recipeTitleSchema = recipeSchema.pick({ title: true })
const sharedRecipeSchema = recipeSchema.extend({ shareUrl: z.url() })

const draft = newRecipeSchema.parse({ title: '  Mercimek  ', note: '', isPublic: false })
console.log(draft.title)
```

İlk parse id istemez, çünkü yeni kayıt oluşmadan id henüz mevcut değildir. Ama title kuralı yeni şemaya aktarılır ve trimlenir. Kart başlığı şeması diğer alanları taşımaz. Paylaşım şeması ise tam tarifin koşullarını koruyup URL koşulu ekler.

| Kullanım | Şema | Beklediği alanlar |
| --- | --- | --- |
| Saklanmış kayıt | recipeSchema | id, title, note, isPublic |
| Yeni form girdisi | newRecipeSchema | title, note, isPublic |
| Başlık görünümü | recipeTitleSchema | title |
| Paylaşılan kayıt | sharedRecipeSchema | temel alanlar + shareUrl |

Adım adım bakınca önce temel alan kuralları kurulur; sonra her kullanımın alan seçimi veya ek alanı açıklanır. Her türetilmiş şema ayrı bir çalışma zamanı değeri doğrular. TypeScript tarafında z.infer ile form tipi alınabilir; fakat bu tip parse etmeden gelen isteği kontrol etmez. Sınırda doğru türetilmiş şema çağrılmalıdır.

## Hangi yönde türetmeli?

Bir veri şeması büyüdükçe her UI için ayrı, elle kopyalanmış şema yazmak ilk bakışta basit görünür. Ancak title boş olamaz kuralı değiştiğinde tüm kopyaları güncellemek gerekir. Temel kayıt şeması bu kuralı bir kere tanımlar; farklı işlemlerin alan kapsamı kompozisyonla belirlenir.

Her şeyi en büyük nesneden türetmek zorunda değilsin. Bir form ile kayıt şeması arasında dönüşüm çok farklıysa ayrı şemalar daha okunur olabilir. Ayrıca extend ile dışarıdan gelen nesnenin alanlarını ne kadar kabul edeceğini düşün. Zod object varsayılan davranışı bilinmeyen key'leri çıktıda strip edebilir; dış girdiyi saklarken ek alanları koruman gerekiyorsa uygun object politikasını bilinçli seç.

Utility tip ile şema işlemi beraber kullanılabilir: biri statik kod imzasını, diğeri runtime parse'ı sağlar. Aynı ismin bulunması davranışlarının eşit olduğu anlamına gelmez. TypeScript Omit parse sonucu üretmez; Zod omit yeni şema üretir. İhtiyacın hem derleme tipi hem gerçek girdi kontrolüyse şemadan tip türet ve doğru şemayı parse et.

:::mistake[TypeScript Omit ile girdiyi doğrulamak]
Belirti → Yeni kayıt tipinde id opsiyonel görünür ama parse sırasında id zorunlu kalır. Neden → Yalnızca TypeScript tipi daraltıldı; Zod şeması tam kaydı bekliyor. Düzeltme → Runtime için omit ile türetilmiş şemayı parse et.
:::

:::mistake[Aynı alan kuralını kopyalamak]
Belirti → Başlık görünümünde boş isim kabul edilir, kayıt şemasında edilmez. Neden → Şemalar bağımsız yazıldı. Düzeltme → Ortak kuralları temel nesne şemasında tanımla, kullanım farkını pick/omit/extend ile belirt.
:::

:::sector
Ekipler API'den gelen tam kayıt, create/update payload'ı ve UI görünümü için birbirinden farklı çalışma zamanı sözleşmeleri tanımlar. Türetim, ortak alan kurallarını korur; her endpoint'in aynı alanları alması gerektiğini iddia etmez. Client ve sunucuda hangi shape'in geçerli olduğunu isimlendirmek, yanlış payload'ı erken yakalar.
:::

## Özet

- TS utility tipi compile-time şekli, Zod kompozisyonu runtime parse kuralını değiştirir.
- omit, pick ve extend ortak alan koşullarını koruyarak yeni şema üretir.
- Farklı iş akışları farklı alan sözleşmeleri kullanabilir.
- Türetilmiş şema da ham veriye uygulanmalıdır.

**Kendini yokla:** TS Omit ile Zod omit arasındaki asıl fark nedir?  
*Cevap:* İlki tipi, ikincisi çalışma zamanı parse şemasını türetir.
