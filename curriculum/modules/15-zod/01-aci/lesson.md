---
title: "Tipin susturduğu çökme"
minutes: 13
kind: concept
---

# Tipin susturduğu çökme

:::pain[Problem]
TMDB, Dövüş Kulübü detayında `title: null` döndürdü. `getJson<MovieDetails>` başlığı string sanıyordu; `movie.title.toUpperCase()` çağrısı sayfayı çökertti. Derleme yeşildi, çünkü TypeScript ağ cevabını hiç görmemişti.
:::

## Derleyicinin göremediği sınır

TypeScript, kaynak kodundaki değerlerin nasıl kullanılacağını denetler. Ama JSON, URL, form alanı ve environment değişkeni uygulama çalışırken gelir. Derleyici bunların gelecekte hangi biçimde olacağını bilemez. Bir generic dönüş tipi, `as` ifadesi veya interface yazmak gelen baytları incelemez; bunlar yalnızca kodun derleme zamanı iddialarıdır.

:::model[Tip derlemede, veri çalışma anında]
TypeScript tipleri derleme sırasında kontrol edilir ve JavaScript çıktısında silinir. Dışarıdan gelen değerin tipi başlangıçta bilinmiyorsa `unknown` olarak tut; Zod şeması çalışma anında onu denetler. Başarılı parse, doğrulanmış çıktıyı verir; başarısız parse, verinin kullanıldığı yere ulaşmasını engeller.
:::

![Tiplerin derleme zamanında silinip dış verinin doğrulanması gerektiğini gösteren akış](diagram:ts-derleme-ve-calisma)

![Bilinmeyen dış verinin doğrulamayla tipli veriye ya da hataya ayrıldığını gösteren akış](diagram:zod-sinir)

Bu sınırın kesin kuralları şöyle:

1. **Dış kaynak kuralı:** Ağ cevabı, URL değeri, kullanıcı girdisi ve çalışma zamanı ayarı tipli kabul edilmeden önce doğrulanmalıdır.
2. **Dürüst başlangıç kuralı:** Kaynağın içeriğini henüz kanıtlamadıysan değeri `unknown` olarak ele al. `any`, kontrolleri kapatır; `unknown`, kullanmadan önce kontrol istemeye devam eder.
3. **Tip iddiası kuralı:** `getJson<MovieDetails>()` veya `raw as MovieDetails` gerçek veriyi değiştirmez ve alanları kontrol etmez.
4. **Sınır kuralı:** Doğrulamayı veriyi alan bileşenlerde tekrarlamak yerine API client, form submit veya config okuyucu gibi giriş noktasında yap.
5. **Sonuç kuralı:** Doğrulama başarılıysa yalnızca parse edilmiş değeri sonraki katmana ver; başarısızsa kontrollü hata akışına geç.

Type guard ile bir alanı doğrulayabilirsin. Fakat nesnenin kendisi, alanların varlığı, diziler ve her dizi öğesi için ayrı ayrı kanıt gerekir. İki alanlı küçük bir nesnede bu yöntem anlaşılır kalır; yanıt büyüyüp `credits.cast[].name` gibi iç içe yapılar eklenince kontrol kodu iş mantığını gölgelemeye başlar. Şema, beklenen yapıyı tek bir yerde görünür kılar.

## Bir başlığın yolculuğunu izleyelim

| An | İşlem | `title` hakkındaki bilgi |
| --- | --- | --- |
| 1 | `fetch` tamamlanır, JSON okunur | İçerik dış kaynaktan geldi; henüz `unknown` |
| 2 | `movieSchema.safeParse(raw)` çalışır | Şema nesneyi ve başlık alanını denetler |
| 3a | `success === true` | `result.data.title` şemanın çıktısıdır ve stringtir |
| 3b | `success === false` | Hata bilgisi vardır; bozuk başlık film nesnesine verilmez |
| 4 | UI doğrulanmış sonucu alır | `.toUpperCase()` geçerli string üzerinde çalışır |

Bu akışta TypeScript ile Zod farklı zamanlarda farklı işler yapar. TypeScript, üçüncü adımın başarı kolunda `result.data.title` alanını string olarak tanır. Zod ise uygulama çalışırken gerçek değeri kontrol etmiştir. Derleme zamanı tipi çalışma zamanı doğrulamasının yerine geçmez; doğrulamanın sonucu, daha sonra güvenle kullanılacak tipe dönüşür.

## Önce iddia, sonra kanıt

Aşağıdaki generic, gövdenin şeklini kontrol etmez:

```ts
async function getJson<T>(url: string): Promise<T> {
  const response = await fetch(url)
  return (await response.json()) as T
}
```

Çağrı `getJson<MovieDetails>(...)` olduğunda fonksiyon JSON'u `MovieDetails` gibi ele alır. Sunucu `title: null` gönderirse değer yine null'dır; yalnızca TypeScript itiraz etmeyi bırakır. Hatanın daha sonra `toUpperCase`, liste render'ı veya başka bir kullanım sırasında görünmesi, onu çözmeyi zorlaştırır.

Bir ayraç kartında beklenen veri çok küçükse şema ile güvenli bir yedek seçebilirsin:

```ts check
import { z } from 'zod'

const badgeSchema = z.object({ label: z.string().min(1) })
function badgeText(raw: unknown): string {
  const result = badgeSchema.safeParse(raw)
  return result.success ? result.data.label : 'Etiket kullanılamıyor'
}
console.log(badgeText({ label: 'Yeni' }))
```

Burada bozuk kayıt bir kartı düşürmek zorunda değildir; kart kendi güvenli metnini gösterebilir. Aynı tercihi bütün sistem için kural hâline getirme. API isteğinin temel verisi bozuksa Query'nin başarı verisi gibi saklamaktansa sorguyu hataya taşımak daha doğru olabilir. Hata politikasını sınırın ve ekranın sorumluluğuna göre seç.

Şemayı kurmak da tek başına yeterli değildir; onu gerçek giriş noktasında çağırmalısın. JSON `unknown` okunur, sonra parse edilir. Bir kez parse edilmiş sonucu aynı veriyi tüketen kartlara geçirmek, her kartın kendi küçük doğrulayıcısını yazmasından daha tutarlıdır. Yine de bir bileşen ayrı bir kullanıcı girdisi alıyorsa, o yeni sınır için doğrulama gerekir.

TypeScript'in `strict` ayarı çalışma zamanı verisini denetlemez. Derleyicinin verdiği “bu kullanım tutarlı” mesajı, “sunucu bu alanı gerçekten gönderdi” anlamına gelmez. İki güvence birlikte çalışır: çalışma zamanındaki şema dış değeri sınar; çıkarılan TypeScript tipi başarılı parse sonrasındaki kodu korur.

## Sınırın yerini doğru seç

Doğrulama noktası, girdinin güvenilmeyen dünyadan uygulamanın kendi koduna geçtiği yerdir. Fetch cevabında bu nokta API client; formda resolver ya da submit sınırı; config'te uygulama başlangıcıdır. Aynı ham nesne üç farklı bileşende tüketiliyorsa doğrulamayı her tüketiciye koymak, birinin kontrolü unutmasına açık kapı bırakır. API client'ta parse edilmiş değeri döndürmek bütün çağıranlara aynı garantiyi verir.

Her girdiyi aynı hata davranışına zorlamak da doğru değildir. Ana detay verisi bozuksa query'yi hata durumuna geçirmek, yarım bir film objesi göstermemekten daha güvenlidir. Küçük bir kart özeti ise bağımsız olarak çökerse bütün sayfayı düşürmek yerine yedek metin sunabilir. Bu karar veri sözleşmesini gevşetmez; doğrulama başarısızlığının kullanıcıya nasıl sunulacağını belirler.

Şema alanları tam ihtiyaç kadar seçilmelidir. Kullanılmayan her API alanını ilk günden doğrulamak gereksiz bakım yükü yaratır. Ancak alanın opsiyonelliği, null olabilirliği ve boş metne izin verilip verilmeyeceği bilinçli olarak belirlenmelidir. Kullanmadığın bir nested alanı şimdilik kapsam dışında bırakabilirsin; kullandığın başlığın null olmasına sessizce izin veremezsin. Bu ayrım şemanın okunabilirliğini ve servis değişikliklerinde hata yerinin bulunmasını kolaylaştırır.

## Sık yanılgılar

:::mistake[Tip iddiasını kanıt sanmak]
**Belirti →** Derleme başarılıdır ama başlık kullanımında `null` hatası çıkar. **Neden →** Generic veya `as` yalnızca derleyiciye bir iddia verdi. **Düzeltme →** JSON'u `unknown` al ve kullanmadan önce çalışma zamanı şemasıyla doğrula.
:::

:::mistake[`any` ile bilinmeyeni geçiştirmek]
**Belirti →** `raw.title.toUpperCase()` satırı hiçbir tip uyarısı vermeden çalışır ve çöker. **Neden →** `any` sonraki erişimlerde kontrolü kapattı. **Düzeltme →** Girişte `unknown` kullan; doğrulama başarılı olmadan alanı okuma.
:::

:::mistake[Doğrulamayı geç kullanmak]
**Belirti →** Hata ağ cevabı geldikten birkaç bileşen sonra görülür. **Neden →** Ham veri uygulama içinde dolaştı ve birden çok tüketici varsayım yaptı. **Düzeltme →** Parse işlemini API client gibi sınır katmanına al ve yalnızca doğrulanmış sonucu döndür.
:::

:::sector
Ekipler API client'larda dış gövde tipini `unknown` başlatır ve endpoint şemasını client çağrısında zorunlu tutar. Hata kaydında hangi endpoint'in, hangi alan yolunda bozulduğu tutulur; kullanıcıya ise servis iç yapısını açığa çıkarmayan kısa bir mesaj gösterilir. Böylece yeni geliştirici de “generic yazılmış, o hâlde güvenlidir” varsayımıyla ham veriyi UI'a taşıyamaz.
:::

## Özet

- TypeScript derleme zamanı kodunu denetler; HTTP cevabını çalışırken incelemez.
- Generic ve `as` gerçek veride doğrulama yapmaz.
- Dış girdiyi önce `unknown` kabul et, şemada doğrula, başarılı sonucu kullan.
- Doğrulamayı her ekranda tekrarlamak yerine veri giriş sınırına koy.

**Kendini yokla:** `getJson<Movie>()` sunucunun doğru `Movie` döndürdüğünü kanıtlar mı?  
*Cevap:* Hayır; generic derleme zamanı iddiasıdır. JSON'u ayrıca doğrulamalısın.

**Kendini yokla:** Bozuk bir liste yanıtında hangi katman hatayı ilk yakalamalı?  
*Cevap:* JSON'u alan API client; veri UI'a veya cache'e ulaşmadan.
