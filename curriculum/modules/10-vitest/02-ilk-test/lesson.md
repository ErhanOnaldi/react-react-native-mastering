---
title: "Testi Vitest ile çalıştır"
minutes: 16
kind: concept
---

# Testi Vitest ile çalıştır

:::pain[Sinema’da ne oldu?]
Bir sinema seansının süresi 127 dakika. Ekranda yalnız 127 görünmesi teknik olarak doğru sayı, ama izleyiciye saat ve dakika ayrımı yardımcı olur. Derleyici süre değerinin number olduğunu görür; gösterim kararını çalıştırmaz.
:::

## Önceki test deneyimini derinleştir

0. modülde `describe`, `it`, `expect` parçalarını okudun; 1–6. modüllerde saf fonksiyon ve reducer için assertion yazdın. Bu derste Vitest’in çalışma düzenini yakından izleyip testin ne zaman gerçekten güvence verdiğini ayıracaksın. Hazırlık–çalıştırma–doğrulama (AAA) yeni bir tören değil; testin girişini, gerçek davranış çağrısını ve dışarıdan ölçülen sonucunu karıştırmamanı sağlayan bir okuma biçimidir.

Test runner dosyaları bulur, `describe` içindeki senaryoları toplar, `it` gövdelerini çalıştırır ve başarısız assertion’ları raporlar. `expect` tek başına test değildir: test gövdesinin içinde çalışıp koşul yanlışsa hata üretir. Testte global API’ler kapalıysa gerekli araçları `vitest` paketinden açıkça import etmen gerekir; bu, dosyanın hangi araçlara bağlı olduğunu görünür kılar.

![Testin hazırla, çalıştır, doğrula akışı](diagram:test-anatomisi)

## AAA kuralları

1. **Arrange:** çağrının girdisini ve yalnızca gerekli durumu hazırla.
2. **Act:** davranışı çağır ve dönen değeri anlamlı bir adla sakla.
3. **Assert:** gereksinime uygun matcher ile sonucu karşılaştır. Beklenti hatalıysa test kırmızı olmalı.
4. Her `it` bir davranış cümlesi taşısın; başlık hangi koşulda ne beklendiğini söylesin.
5. Test verisini sonucu okuyacak kadar küçük tut. Gereksiz mock, setup ve değişken ekleme.

İki değer arasındaki her fark aynı matcher’la ölçülmez. Süre kullanıcıya gönderilen metinse "2 sa 7 dk" stringini bekle; dakika hesabını sınayan birim testi ise sayısal sonucu karşılaştır. Görünür çıktıyı test ederken hesaplamanın iç ayrıntısını assertion’a taşıma.

## Bir assertion’ın zaman çizelgesi

```ts
import { describe, expect, it } from 'vitest'

function formatRuntime(minutes: number): string {
  const hours = Math.floor(minutes / 60)
  const remaining = minutes % 60
  return hours > 0 ? hours + ' sa ' + remaining + ' dk' : remaining + ' dk'
}

describe('formatRuntime', () => {
  it('süreyi saat ve dakika olarak gösterir', () => {
    const minutes = 127 // Arrange
    const label = formatRuntime(minutes) // Act
    expect(label).toBe('2 sa 7 dk') // Assert
  })
})
```

Modül yüklenirken Vitest test kayıtlarını görür. Runner test gövdesine girdiğinde minutes değeri 127 olur. formatRuntime çağrısı "2 sa 7 dk" üretir ve label içine yazılır. Son satırdaki expect bu stringi tam eşitlikle karşılaştırır. Fonksiyon yalnız "127" döndürürse test burada durur ve beklenen ile gelen değeri raporlar.

Bu sıra hatanın yerini de gösterir. Arrange yanlışsa gerçek davranış istenen koşulda çalışmamıştır. Act yanlış fonksiyonu veya girdiyi çağırıyorsa assertion başka bir senaryoyu ölçer. Assert fazla gevşekse bug çalışmış olsa bile test yeşil kalabilir. AAA etiketlerini her satıra yorum olarak yazman şart değil; dosyayı okuyan kişi bu üç adıma cevap bulabilmeli.

## Kırık beklentiyi görünür yap

Sırf yeşil sonuç görmek testin doğru olduğunu kanıtlamaz. Aşağıdaki kontrol hatalı değeri de kabul eder:

```ts check
function formatRuntime(minutes: number): string {
  return String(minutes)
}

const label = formatRuntime(127)
if (label.length === 0) throw new Error('Beklenmeyen boş değer')
```

Gereksinim tam string ise tam stringi yaz. Bu kod kendi başına çalışır, fakat yanlış biçimde de hata vermez; güvence sağlamaz. Şimdi kırık uygulamayı doğru beklentiyle karşılaştır:

```ts check
function formatRuntime(minutes: number): string {
  return String(minutes)
}

const label = formatRuntime(127)
if (label !== '2 sa 7 dk') throw new Error('Beklenen 2 sa 7 dk, gelen ' + label)
```

Yanlış implementasyon bu kez kırmızı olur. Doğru biçimleme süreyi saat ve dakika parçalarına ayırabilir; uygulama yöntemi testin konusu değildir. Önemli olan 127 dakika girdisinin dışarıda "2 sa 7 dk" olarak görülmesidir. Böylece uygulamanın içini değiştirebilirsin ama kullanıcı sözleşmesini sessizce bozamazsın.

Gerçek testte aynı beklenti Vitest matcher’ıyla ifade edilir:

```ts
expect(formatRuntime(127)).toBe('2 sa 7 dk')
```

Saf fonksiyonlar çoğu zaman hem normal girdi hem özel anlam taşıyan sınır değer alır. Örneğin sıfır dakika “süre yok” anlamına gelebilir; bunu boş stringle karıştırıp karıştırmayacağına ürün kuralı karar verir. Farklı davranışlar için ayrı test kullan; kırmızı rapor hangi kuralın bozulduğunu söyler.

## Import ve bağımsızlık

Test dosyasını `.test.ts` veya `.test.tsx` ile bitirmek Vitest’in varsayılan keşif düzenine uyar. API’leri açık import etmek `globals: false` ayarıyla uyumludur:

```ts
import { describe, expect, it } from 'vitest'
import { formatRuntime } from './formatRuntime'
```

`describe` testleri gruplar ama kendi başına durum saklamaz. `it` bağımsız örneği çalıştırır. Bir test başka bir testin önce çalışmasına güvenmemeli; runner dosyaları farklı sırada veya worker’larda çalıştırabilir. Ortak durum gerekiyorsa hazırlık ve cleanup açık olmalı. Saf fonksiyon testinde global duruma dokunmamak en basit seçenektir.

Testi koddan ayrı duran dokümantasyon gibi değil, çalışan örnek gibi oku. Test adı davranışı söyler; Arrange o davranışa girdi verir; Act gerçek fonksiyonu çalıştırır; Assert sonucu belirtir. Bir dosyada yalnız `it.todo` varsa Vitest niyeti kaydeder ama davranış hakkında kanıt üretmez.

Bir testin güven verdiğini anlamanın pratik yolu şudur: bilinen hatalı değerle bu test kırılır mı? Her mutantı elle üretmek gerekmez, ancak assertion’ın hangi farkı yakaladığını zihninde canlandır. Tam string beklentisi ondalık kaybını yakalar; “boş değil” beklentisi yakalamaz. Bir test başlığı değişen girdi için aynı sonucu beklediğini açıkça söylemeli; “format test” gibi başlıklar teşhis için bilgi taşımaz.

:::mistake[Assertion’ı çağrıdan önce yapmak]
**Belirti:** Beklenti sonuç üretilmeden çalışır veya kontrol anlamsız kalır. → **Neden:** Act ile Assert sırası karışmıştır. → **Düzeltme:** Önce davranışı çalıştır, değeri sakla, sonra matcher’a ver.
:::

:::mistake[Boolean varlığını doğrulamak]
**Belirti:** Yanlış string dönen sürüm de geçer. → **Neden:** Test yalnız sonucun boş olmadığını ölçüyordur. → **Düzeltme:** Beklenen tam değeri veya anlamlı alanları karşılaştır.
:::

:::mistake[Global API’ye gizlice güvenmek]
**Belirti:** `describe is not defined` hatası çıkar. → **Neden:** Global API açılmamıştır ama import da yoktur. → **Düzeltme:** Gerekli fonksiyonları `vitest` paketinden import et.
:::

Test dosyasının kendisi de TS tip kontrolünden geçer. Eksik import veya yanlış callback türü assertion çalışmadan önce derleme hatası çıkarabilir. Bu, testin davranış sonucunun yerine geçmez: dosyanın doğru yazılabildiğini kontrol eder. Önceki TypeScript derslerindeki derleme ve çalışma zamanı ayrımı burada da geçerli; derlenebilen test yine yanlış beklenen değeri içerebilir.

Test runner başarısızlıkları test adıyla gruplayınca her testin tek bir davranışa odaklanması daha da yararlı olur. On farklı girdiyi tek testin içinde döngüyle çalıştırırsan ilk başarısızlık sonraki örnekleri durdurabilir ve rapor hangi örneğin bozulduğunu daha az açık gösterebilir. Parametrik testler bu tekrar ihtiyacını daha sonra yapılandırılmış biçimde çözer.

:::sector
Ekipler test adını küçük bir gereksinim cümlesi gibi yazar: “sıfır dakikalık sürede boş etiket gösteriyor”. Kod incelemesinde önce test adını ve beklentiyi okumak, gözden kaçan sınırları daha hızlı ortaya çıkarır.
:::

Bir test sonucu yeşilse bu, assertion’ın tanımladığın beklentiyi gördüğünü söyler; testin ürün ihtiyacını doğru seçtiğini ayrıca sen değerlendirirsin. Seans süresi 127 dakika olduğunda saat ve kalan dakika gösterimi gerekiyorsa yalnızca 60 dakikalık sınırı denemek bu gereksinimi kanıtlamaz. Aynı davranışı hiç yeni sınır eklemeden benzer örneklerle tekrarlamak da kapsama katkı yapmaz.

AAA düzeni testin kısa kalmasına yardım eder. Arrange içinde gereğinden fazla ortak setup varsa gerçek girdi gözden kaçabilir. Act içinde bağımsız çağrılar varsa assertion’ın hangisini ölçtüğü belirsizleşir. Assert aşamasında birkaç koşul bulunabilir, ancak test adı hepsini taşımalı veya senaryolar ayrılmalıdır. Okunabilirlik satır sayısından değil, testin tek bakışta açıklanabilmesinden gelir.

Başarısız raporda beklenen ve gelen değerler görünür. Test adının da bağlam vermesi gerekir: “değer biçimlenir” yerine “seans süresini saat ve dakika olarak gösterir” başlığı ürün davranışını hatırlatır. Böylece log’a bakarken hangi sözleşmenin bozulduğunu anlarsın.

## Özet

- AAA, girdiyi hazırlama, davranışı çalıştırma ve sonucu doğrulama sırasıdır.
- Vitest API’lerini açık import etmek bağımlılıkları görünür kılar.
- Matcher, kullanıcının gördüğü sözleşmenin tamlığına uymalıdır.
- Testin gerçekten koruduğunu anlamak için yanlış sonuçta kırıldığını düşün.
- Her test bağımsız bir davranış adı ve anlaşılır girdi taşımalıdır.

**Kendini yokla:** `"7"` dönen fonksiyon neden yalnızca `value.length > 0` testinden geçer? Çünkü test ondalık basamağı şart koşmaz.

**Kendini yokla:** Arrange ile Act arasındaki fark nedir? Arrange girdiyi kurar; Act gerçek davranışı çalıştırır.

