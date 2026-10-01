---
title: "Vitest ile ilk testi yaz"
minutes: 14
kind: concept
---

# Vitest ile ilk testi yaz

Sinema’da bir filmin süresini okunur etikete çevirdiğini düşün. Fonksiyonu elle çağırıp sonucu görebilirsin; ama her kod değişikliğinden sonra aynı kontrolü elle yapmak kolayca unutulur. Test, bu beklentiyi tekrar tekrar çalıştırılabilen örnek olarak dosyada tutar.

## Bir sonucu bekle

`it`, tek bir davranış senaryosunu tanımlar. `expect`, gerçek değeri alır; ardından gelen **assertion**, gerçek değerin beklenen koşulu sağladığını doğrular.

```ts check
import { expect, it } from 'vitest'

it('film başlığını büyük harfe çevirir', () => {
  const title = 'Kıyı'.toUpperCase()
  expect(title).toBe('KIYI')
})
```

Test çalışınca `title` değeri `KIYI` olur ve assertion beklenen stringle karşılaştırır. Değer farklıysa bu satır hata üretir; test bu davranış için başarısız sayılır.

İlişkili senaryoları `describe` ile gruplayabilirsin. Grup adı sonuç değiştirmez; raporda testleri bir arada görmeni sağlar.

```ts check
import { describe, expect, it } from 'vitest'

describe('film başlığı', () => {
  it('başlığı büyük harfe çevirir', () => {
    const title = 'Kıyı'.toUpperCase()
    expect(title).toBe('KIYI')
  })
})
```

`describe` içindeki `it` aynı işi yapar. Grup ve test adını birlikte okuyunca hangi davranışın başarısız olduğu anlaşılır. İsimde koşulu ve beklenen sonucu söyle.

## Girdiden beklentiye: AAA

**Arrange–Act–Assert (AAA)** test gövdesini okuma düzenidir: Arrange girdiyi hazırlar, Act gerçek davranışı çalıştırır, Assert sonucu doğrular. Bu sıra önemlidir; sonuç davranış çalışmadan önce var olamaz.

![Testin hazırla, çalıştır, doğrula akışı](diagram:test-anatomisi)

Sinema’daki süre etiketini oluşturan küçük fonksiyona bakalım:

```ts check
import { expect, it } from 'vitest'

function formatRuntime(minutes: number): string {
  const hours = Math.floor(minutes / 60)
  const remaining = minutes % 60
  return hours > 0 ? hours + ' sa ' + remaining + ' dk' : remaining + ' dk'
}

it('127 dakikayı saat ve dakika olarak gösterir', () => {
  const minutes = 127
  const label = formatRuntime(minutes)
  expect(label).toBe('2 sa 7 dk')
})
```

Akışı sırayla izleyelim:

| Sıra | Bölüm | Değer / sonuç |
| --- | --- | --- |
| 1 | Arrange: girdi hazırlanır | `minutes` değeri `127` |
| 2 | Act: fonksiyon çağrılır | `formatRuntime(127)` → `2 sa 7 dk` |
| 3 | Act: sonuç saklanır | `label` değeri `2 sa 7 dk` |
| 4 | Assert: sonuç karşılaştırılır | Beklenenle aynı, test geçer |

Girdi yanlış hazırlanırsa hedef davranışı sınamamış olursun. Yanlış fonksiyonu çağırırsan başka davranışı ölçersin. Beklenti gevşekse hata varken de test geçebilir. AAA bu üç sorunu birbirinden ayırır; her satıra yorum eklemek gerekmez.

## Vitest dosyayı nasıl çalıştırır?

Vitest, test dosyalarını bulup senaryoları çalıştıran **test runner**’dır. Dosya yüklenirken `describe` ve `it` kayıtlarını toplar; ardından test gövdelerini çağırır ve başarısız assertion’ları raporlar. Dosyanın `.test.ts` veya `.test.tsx` ile bitmesi varsayılan keşif düzenine uyar.

Beklentiyi bilerek yanlış yazarsak ne olur?

```ts check
import { expect, it } from 'vitest'

it('film süresini okunur gösterir', () => {
  const label = '2 sa 7 dk'
  expect(label).toBe('127 dk')
})
```

Runner bu teste geldiğinde `expect` iki farklı string görür ve testi başarısız raporlar; beklenenle gelen değer raporda yer alır. Hata her zaman uygulama hatası değildir: bazen beklentiyi yanlış yazmışsındır. Raporu ürün davranışıyla karşılaştır.

Testte gereken API’leri `vitest` paketinden açıkça import et. Proje ayarı bu fonksiyonları dosyaya otomatik vermiyorsa `describe`, `it` veya `expect` import edilmeden kullanılamaz. Her test kendi girdisini hazırlasın; başka bir testin önce çalışmasına güvenmek, sıra değişince sonucu da değiştirebilir.

Bir dosyada birkaç `it` varsa her test başlığını ayrı bir gereksinim cümlesi gibi oku. Örneğin “127 dakikayı saat ve dakika olarak gösterir” ile “30 dakikayı yalnız dakika olarak gösterir” farklı çıktıları tarif eder. İlki başarısızsa uzun süre biçimlemesine, ikincisi başarısızsa kısa süre biçimlemesine bakarsın; başlıklar hata aradığın alanı daraltır.

Testi yalnızca bir kere çalıştırmak için yazmıyorsun. Sonraki değişiklikte aynı dosya tekrar çalışır ve yeni kodun da beklenen sonucu üretip üretmediğini sorar. Bu nedenle testte ürünün dışarıdan görülen sonucunu sabitle; fonksiyonun içindeki geçici değişken adını veya hesaplama adımlarını beklentiye bağlama. İçeriyi yeniden düzenlediğinde kullanıcı davranışı aynı kalıyorsa test de geçmeye devam etsin.

Yeşil sonuç, assertion’ın yazdığın koşulu gördüğünü söyler; ihtiyacı doğru seçtiğini ayrıca sen değerlendirirsin. Yalnız `label.length > 0` dersen `127` de geçer. Gereksinim tam olarak `2 sa 7 dk` ise tam stringi beklemek gösterim hatasını yakalar.

Test yazma görevlerinde **mutant**, testinin hatayı yakalayıp yakalamadığını ölçmek için bilerek hatalı hale getirilmiş uygulama sürümüdür. Mutant seçilen hataya rağmen geçerse beklentin o hatayı yakalamıyor olabilir. Bu, “yanlış değerle test kırılır mı?” sorusunun somut kontrolüdür.

:::mistake[Önce doğrulayıp sonra çağırmak]
**Belirti:** Beklenti henüz üretilmemiş sonucu ölçer. → **Neden:** Act ile Assert sırası karışmıştır. → **Düzeltme:** Önce girdiyi hazırla, davranışı çağır, sonra sonucu karşılaştır.
:::

:::mistake[Boş olmamasını yeterli görmek]
**Belirti:** Yanlış biçimdeki metin de testten geçer. → **Neden:** Beklenti yalnızca bir string bulunduğunu söyler. → **Düzeltme:** Kullanıcının görmesi gereken değeri doğrudan bekle.
:::

:::info[Derinlemesine (isteğe bağlı)]
Vitest testleri paralel çalıştırmak için worker süreçleri kullanabilir. **Worker**, testi ana süreçten ayrı yürüten çalışma birimidir. Saf fonksiyon testlerinde bu ayrıntıyı bilmen gerekmez; testlerin ortak duruma güvenmemesi yeterlidir.
:::

## Özet

- `it` bir davranış senaryosu, `describe` ilişkili senaryoları gruplar.
- `expect` ve matcher sonucu beklentiyle karşılaştırır; assertion bu doğrulamadır.
- AAA girdiyi hazırlama → davranışı çalıştırma → sonucu doğrulama sırasıdır.
- Test runner testleri bulur, çalıştırır ve başarısızlıkları raporlar.
- Yeşil test yalnız yazdığın beklentiyi kanıtlar; beklentiyi gerçek ihtiyaca göre seç.

**Yeni terimler**

- **Assertion:** Gerçek sonucun beklenen koşulu sağladığını doğrulayan ifade.
- **Arrange–Act–Assert (AAA):** Girdiyi hazırlama, davranışı çalıştırma ve sonucu doğrulama sırası.
- **Test runner:** Test dosyalarını bulup senaryoları çalıştıran araç.
- **Mutant:** Testin hata yakalayıp yakalamadığını sınamak için bilerek bozulan uygulama sürümü.
- **Worker:** Test işini ana süreçten ayrı yürüten çalışma birimi.

**Kendini yokla:** `label` hangi adımda oluşur? Act sırasında fonksiyon çağrısının sonucunu saklarken.

**Kendini yokla:** Yeşil test, tüm olası girdilerin doğru olduğunu kanıtlar mı? Hayır; yalnızca yazdığın beklentinin geçtiğini gösterir.
