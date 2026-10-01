---
title: "Şemaları amaca göre türet"
minutes: 13
kind: concept
---

# Şemaları amaca göre türet

TypeScript'te 2.2'de `Pick` ile bazı alanları seçmiş, `Omit` ile bazılarını çıkarmıştın. Bunlar editörde tiplerin şeklini anlatır. Zod'da da aynı adlarla işlemler var; farkı, bunların gelen veriyi `parse` edebilen yeni bir şema üretmesi. Bir şema, hangi alanların kabul edildiğini ve bu alanların nasıl denetlendiğini tarif eder.

Sinema'da aynı film bilgisi kayıt, kart ve düzenleme ekranında farklı alanlarla kullanılır. Alan kurallarını tekrar tekrar yazmak yerine ortak bir şemadan her kullanım için uygun bir şema çıkarabilirsin. Bu işleme burada **şema kompozisyonu** diyeceğiz: var olan bir şemayı seçerek, çıkararak veya genişleterek yeni bir şema kurmak.

## Önce iki film alanını seç

`Film` tipi tüm film alanlarını içersin; küçük bir kartta yalnızca başlık ve yıl gösterilsin. TypeScript `Pick` bunu tip düzeyinde yapar. Zod `pick` ise aynı alanları doğrulayan çalışma zamanı şeması verir. Çalışma zamanı (runtime), uygulama gerçekten çalışırken kodun yaptığı iştir.

```ts check
import { z } from 'zod'

const filmSchema = z.object({
  id: z.string(),
  title: z.string().min(1),
  year: z.number(),
  synopsis: z.string(),
})
const filmCardSchema = filmSchema.pick({ title: true, year: true })

const card = filmCardSchema.parse({ title: 'Kayıp Şehir', year: 2024 })
console.log(card)
```

`filmCardSchema` yalnızca `title` ve `year` alanlarını ister. `id` ve `synopsis` kart için gerekli değildir; kart şeması onları çıktı olarak da taşımaz. TypeScript'te `Pick<Film, 'title' | 'year'>` benzer bir tip tanımlar, ama ham nesnenin gerçekten bu alanları taşıdığını tek başına denetlemez.

Bu nedenle ekrandan, URL'den veya ağdan gelen değeri Zod şemasıyla parse edersin.

![Bilinmeyen dış verinin şemayla tipli veriye ya da hataya ayrıldığı akış](diagram:zod-sinir)

## Uygulamanın ürettiği alanı çıkar

Şimdi film kaydına uygulamanın verdiği bir `id` eklendiğini düşün. Kullanıcının gönderdiği yeni film girdisinde henüz bu `id` yoktur. Yeni şemayı elle baştan yazmak yerine tam film şemasından `id` alanını çıkarabilirsin:

```ts check
import { z } from 'zod'

const filmSchema = z.object({
  id: z.string(),
  title: z.string().min(1),
  year: z.number(),
})
const newFilmSchema = filmSchema.omit({ id: true })

const draft = newFilmSchema.parse({ title: 'Kıyıdaki Ev', year: 2023 })
console.log(draft.title)
```

`omit` yeni girdide `id` aramaz; `title` ve `year` kurallarını ise temel şemadan alır. Böylece başlık için koyduğun boş olamaz kuralı yeni film girdisinde de geçerlidir. `omit` mevcut nesneden alan silmez; yalnızca yeni bir doğrulama şeması oluşturur. TypeScript `Omit` de tipi değiştirir, fakat runtime doğrulaması yapmaz.

## Aynı şemayı yeni bir bilgiyle genişlet

Sinema'nın film sayfası bir fragman adresi de saklasın. Tam film şemasındaki kuralları koruyup yeni bir alan eklemek için `extend` kullanırsın. Zod 4'te `z.url()` metnin geçerli URL biçiminde olup olmadığını denetler.

```ts check
import { z } from 'zod'

const filmSchema = z.object({
  id: z.string(),
  title: z.string().min(1),
})
const filmWithTrailerSchema = filmSchema.extend({ trailerUrl: z.url() })

const film = filmWithTrailerSchema.parse({
  id: 'film-7',
  title: 'Gece Vardiyası',
  trailerUrl: 'https://sinema.example/fragman/7',
})
console.log(film.trailerUrl)
```

`extend` temel alanları yeniden tanımlamadan `trailerUrl` kuralını ekledi. Başlık yine boş olamaz; fragman adresi de URL değilse parse hata verir. `z.url()` yalnızca string türünde olmayı değil, metnin URL biçimine uymasını ister. Bu kural adresin gerçekten açıldığını veya doğru filme gittiğini kanıtlamaz.

## Düzenleme girdisinde alanları isteğe bağlı yap

Yeni film oluştururken başlık ve yıl gerekir; düzenlemede ise kullanıcı yalnızca değiştirdiği alanı yollayabilir. `partial()` bir nesne şemasındaki alanları isteğe bağlı yapar. Böylece boş bir güncelleme nesnesi bile parse olabilir; uygulamanın gerçekten en az bir değişiklik istemesi gerekiyorsa bu ayrı bir kuraldır ve bu derste ona girmiyoruz.

```ts check
import { z } from 'zod'

const filmDetailsSchema = z.object({
  title: z.string().min(1),
  year: z.number(),
})
const filmEditSchema = filmDetailsSchema.partial()

const edit = filmEditSchema.parse({ year: 2025 })
console.log(edit)
```

`partial()` alanların doğrulama kurallarını silmez; gönderilen alanın değerini yine denetler. Örneğin gönderilen `title` boşsa hata alırsın. Yalnızca alanın hiç gönderilmemesine izin verir. Tüm şemayı opsiyonelleştirmek istemiyorsan yalnızca belirli alanları opsiyonel yapan biçimi de kullanabilirsin: `filmDetailsSchema.partial({ year: true })`.

## Şema merdivenini izleyelim

Bir işlemin nerede çalıştığını sırayla görelim. `filmSchema` temel kuralları kurar; devamındaki her satır ayrı bir şema üretir. Son satırda ham nesneyi seçtiğimiz şemaya veriyoruz.

| Adım | Kod | Sonuç |
| --- | --- | --- |
| 1 | `filmSchema` | `id`, `title`, `year` için temel kurallar |
| 2 | `filmSchema.omit({ id: true })` | Yeni girişinde `id` aramayan şema |
| 3 | `filmSchema.pick({ title: true })` | Yalnız başlığı doğrulayan şema |
| 4 | `filmSchema.extend({ trailerUrl: z.url() })` | Temel alanlar ve fragman adresi |
| 5 | `newFilmSchema.parse(raw)` | Ham değer kontrol edilir; geçerse doğrulanmış çıktı gelir |

Burada önemli sıra şudur: `.omit()`, `.pick()` ve `.extend()` veriyi henüz kontrol etmez; şema tanımlarken yeni bir kural bütünü hazırlar. Kontrol, `parse(raw)` çağrısında olur. `TypeScript Omit` ise derleme aşamasında yalnızca tip bilgisini etkiler. Aynı ada benzemeleri, aynı işi yaptıkları anlamına gelmez.

## Sık düşülen hata: tipi şema sanmak

Diyelim ki TypeScript'te `type NewFilm = Omit<Film, 'id'>` yazdın. Editör, `NewFilm` değişkenine `id` koyduğunda uyarı verir; ama uygulama çalışırken bir JSON nesnesini bu tipe atamak onun içeriğini denetlemez. Belirti, tipte `id` yokken doğrulama beklediğin yerde `id` alanlı veya başlıksız verinin geçmesidir. Çözüm, runtime kontrolü gereken yerde `filmSchema.omit({ id: true }).parse(raw)` çağırmaktır.

Elle ayrı ayrı şemalar yazmak da mümkündür. Ancak `title` kuralını bir yerde güncelleyip diğerinde unutursan iki kullanım farklı veriyi kabul eder. Ortak alan kurallarını bir temel şemada tutmak bu kopya farkını önler; yine de gerçekten farklı sözleşmeler varsa onları ayrı tutmak daha açık olabilir.

:::info[Derinlemesine (isteğe bağlı)]
Zod nesneleri tanımadıkları ek alanları varsayılan olarak parse edilmiş çıktıya almaz. Dış girdide fazladan alanları koruman gerekiyorsa nesne politikasını ayrıca seçmelisin; burada yalnızca şemada tanımlı alanlarla çalışıyoruz.
:::

## Özet

- TypeScript `Pick`/`Omit` tip şeklini değiştirir; Zod `pick`/`omit` parse edilebilir yeni şema üretir.
- `pick` alan seçer, `omit` alan çıkarır, `extend` yeni alan ekler.
- `partial()` nesne alanlarını opsiyonel yapar; gelen alanın kendi kuralı yine uygulanır.
- Bu işlemler şemayı kurar; ham veri `parse()` çağrısında doğrulanır.

**Yeni terimler:**
- **Şema kompozisyonu:** Var olan bir şemadan kullanım amacına göre yeni şema kurma.
- **Runtime (çalışma zamanı):** Uygulama çalışırken kodun gerçekten yürütüldüğü zaman.
- **`pick` / `omit` / `extend` / `partial`:** Alan seçen, çıkaran, ekleyen veya opsiyonel yapan Zod şema işlemleri.

**Kendini yokla:** `filmSchema.omit({ id: true })` ham nesneden `id` alanını hemen siler mi?

*Cevap:* Hayır. Yeni şema üretir; ham nesne ancak bu şema `parse` edilince denetlenir.
