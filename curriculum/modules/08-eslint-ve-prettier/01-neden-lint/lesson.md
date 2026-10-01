---
title: "Lint neyi görür, format neyi değiştirir?"
minutes: 15
kind: concept
---

# Lint neyi görür, format neyi değiştirir?

Bir component’te artık kullanmadığın bir değişken kalabilir. Kod yine ekranda çalışır; ama o satır okuyan kişiye yanlış bir şeyin hâlâ gerekli olduğunu düşündürür. Böyle tekrar eden kaynak kodu sorunlarını programı çalıştırmadan arayan yönteme **statik kod analizi** denir. ESLint, seçtiğin kurallarla bu analizi yapan araçtır.

## İlk küçük bulgu

Sinema’daki bir rozet metnini hazırladığını düşün. İki değişken tanımlı, ama component yalnızca birini gösteriyor:

```tsx check title="Rozet metni"
const label = 'Favori film'
const oldLabel = 'İzleme listesi'

export function FavoriteBadge() {
  return <span>{label}</span>
}
```

`oldLabel` kodda tanımlı ama okunmuyor. ESLint’te kullanılmayan adları bulan bir kural açıksa bu satır için mesaj görürsün. Bu mesaj, uygulamanın çalışmadığı anlamına gelmez; satırın mevcut kodda bir işi olmadığını söyler. Böylece gereksiz satırı kaldırıp component’in ne kullandığını daha kolay görebilirsin.

Bir lint mesajı çoğu zaman dosya adını, satırı ve kural adını gösterir. Kural adı, mesajın hangi denetimden geldiğini bulmana yardım eder. Mesajı gördüğünde önce işaretlenen kodu ve kullanım yerlerini oku; aracın önerisini anlamadan kabul etmek yerine, değişikliğin component’in davranışına etkisini düşün.

![Lint kodun anlamlı kalıplarını, format görünüşünü düzenler](diagrams/lint-ve-format.svg "ESLint kod örüntülerini bulur, Prettier biçimi düzenler.")

## İki araç, iki farklı soru

Şimdi component’teki işi değiştirmeden görünüşünü farklı yazalım:

```tsx check title="Aynı çıktı, farklı görünüş"
export function FavoriteBadge( ) { return <span>Favori film</span> }
```

Bu kodun girintisini, boşluklarını ve satırlarını düzenleyen araca **formatter** denir. Prettier böyle görünüş kararlarını proje genelinde aynı hale getirir. Dosyayı biçimlendirdikten sonra ekranda yine “Favori film” görünür; formatter kullanılmayan bir değişkeni bulup silmeye ya da hatalı davranışı düzeltmeye çalışmaz.

TypeScript’in görevi de ikisinden ayrıdır. TypeScript, değerlerin tanımlı tip sözleşmelerine uyup uymadığını denetler. Örneğin string bekleyen bir alana sayı verirsen tip hatası bulabilir; ama seçtiğin lint kuralları kadar geniş bir kod kalıbı denetimi yapmaz. Birbirini tamamlayan araçlar olarak düşün:

| Araç | Sorduğu soru | Örnek bulgu |
| --- | --- | --- |
| TypeScript | Değerler ve tipler uyumlu mu? | String beklenen yere sayı verilmiş |
| ESLint | Kaynak seçtiğim kod kurallarına uyuyor mu? | Kullanılmayan değişken var |
| Prettier | Kod ortak görünüş tercihine göre yazılmış mı? | Girinti veya satır düzeni farklı |

Kodun bu üç kontrolden geçmesi uygulamanın doğru davranacağını kanıtlamaz. Araçlar yalnızca kendi denetimlerinin kapsadığı şeyleri söyleyebilir; film seçimi değişince doğru filmin görünmesini bir davranış testi veya uygulamayı kullanarak ayrıca kontrol edersin.

## Bir değer değişince neyi lint kontrol eder?

Önceki React derslerinde effect kullandın. Sinema detay bileşeninde adresle gelen `filmId` değiştiğinde effect’in de yeni filmi okuması gerektiğini düşün. Şu kodda effect `filmId` değerini okuyor, ama dependency listesi boş:

```tsx title="Effect girdisi bildirilmemiş"
useEffect(() => {
  document.title = `Film ${filmId}`
}, [])
```

ESLint’in React Hooks kuralı kaynakta okunan değer ile dependency listesi arasındaki uyumsuzluğu gösterebilir. Buradaki `filmId`, effect’in sonucu değişebilecek bir girdidir; böyle değerlere **reaktif değer** denir. Lint component’i çalıştırmaz ve sekme başlığını değiştirmez; kodu okuyup bu ilişkinin bildirilmediğini raporlar.

Effect’in callback’i ilk render’daki `filmId` değerini kullanabilir. Bu yüzden adres değiştiğinde effect’in hangi girdilerle yeniden çalışacağını açıkça bildirmek gerekir. Şimdi olayları sırayla izleyelim:

| Sıra | Ne oluyor? | Araç veya React neyi görür? | Sonuç |
| --- | --- | --- | --- |
| 1 | `filmId` ilk render’da `550` | TypeScript tip ilişkilerini denetler | Tip uyumu varsa geçer |
| 2 | Effect `filmId` okur, liste boştur | ESLint kaynakta eksik bildirimi bulur | Lint mesajı çıkar |
| 3 | Adres `155` olur | React yeni render değerini üretir | Önceki effect kendiliğinden yeni değeri okumaz |
| 4 | Kod düzeltilip lint tekrar çalışır | Kural kaynak ilişkisini yeniden denetler | Mesajın kalkması davranış testinin yerine geçmez |

Tablo, lint’in neden yararlı ama sınırlı olduğunu gösteriyor. Araç, sık yapılan bir unutmayı erkenden görünür kılar; effect’in doğru zamanda doğru veriyi göstereceğini tek başına kanıtlamaz. Sorunun nedeni tipi değil, effect’in hangi değer değişince güncelleneceğinin kaynakta açıklanmamasıdır.

## Mesajı görünce nasıl ilerlersin?

Bir lint mesajında önce dosyayı ve satırı aç. Sonra kural adını ve işaretlenen kullanım yerlerini incele. Kullanılmayan bir tanımsa kaldırmak genellikle doğru adımdır; effect’in kullandığı bir değerse, onu yokmuş gibi göstermek yerine effect’in girdisini anlamalısın. Düzeltmeden sonra aynı kontrolü tekrar çalıştır ve davranış değişmiş olabilecekse uygulamada ya da testte doğrula.

ESLint mesajları `error` veya `warning` önem derecesiyle gösterilebilir. `error` genellikle komutu başarısız kılacak şekilde ayarlanır; `warning` ise uyarı olarak görünür. Proje ayarı bu davranışı etkileyebilir. **CI**, kod değişiklikleri depoya alınmadan önce otomatik kontrolleri çalıştıran hizmettir; yerelde temiz görünen kodun aynı lint komutundan orada da geçmesi bu yüzden yararlıdır.

`Parser`, kaynak kod metnini ESLint’in anlayabileceği yapıya çeviren parçadır. Yanlış dosya uzantısı veya parser ayarı yüzünden kod okunamıyorsa parser/sözdizimi mesajı görebilirsin; bu, bir lint kuralının bulduğu sorundan farklıdır. Önce dosyanın ESLint kapsamına ve uygun parser’a girdiğini kontrol etmek, ardından kural mesajlarını incelemek gürültüyü azaltır.

:::info[Derinlemesine (isteğe bağlı)]
ESLint’in `--fix` seçeneği ve editörün hızlı düzeltmesi bazı mekanik değişiklikleri uygulayabilir. Özellikle effect bağımlılığı eklemek çalışma zamanındaki güncellemeleri etkileyebileceği için değişikliği yine oku. `--max-warnings 0` gibi bir ayar warning’leri de komut hatasına dönüştürebilir; bu da proje tercihidir.
:::

## Sık karşılaşılan yanlış beklentiler

:::mistake[Derleme geçtiyse davranış doğrudur]
Belirti → Tip kontrolü geçer ama film kimliği değişince ekranda eski film kalır. Neden → Tip denetimi effect’in hangi değişimde yeniden çalışacağını söylemez. Düzeltme → Hook lint mesajını incele ve davranışı ayrıca doğrula.
:::

:::mistake[Prettier kullanılmayan kodu temizler]
Belirti → Dosya biçimlenmiştir ama kullanılmayan bir ad duruyordur. Neden → Prettier görünüşü düzenler, kodun gerekli olup olmadığına karar vermez. Düzeltme → Görünüş için Prettier, kaynak kuralları için ESLint kullan.
:::

:::mistake[Mesajı susturmak sorunu çözer]
Belirti → Lint temizdir ama eski başlık hâlâ görünür. Neden → Kuralı kapatmak kod ile davranış arasındaki ilişkiyi düzeltmez. Düzeltme → Mesajın işaret ettiği niyeti çöz; sonra sonucu test et.
:::

## Özet

- TypeScript tipleri, ESLint seçili kaynak kod kurallarını, Prettier görünüşü denetler.
- Lint mesajını dosya, satır ve kural adıyla birlikte oku; otomatik düzeltmeyi de gözden geçir.
- Temiz lint yalnızca etkin kuralların ve kapsanan dosyaların temiz olduğunu söyler.
- Effect girdisini kaynakta doğru bildirmek eski değerle çalışma riskini azaltır.

**Yeni terimler:**

- **Statik kod analizi:** Programı çalıştırmadan kaynak kod örüntülerini inceleme.
- **Formatter:** Kodun görünüşünü ortak biçim kurallarına göre düzenleyen araç.
- **Reaktif değer:** Değişince React’teki effect veya gösterimi etkileyebilen değer.
- **CI:** Kod değişikliklerinde otomatik kontrolleri çalıştıran hizmet.
- **Parser:** Kaynak metnini aracın anlayacağı yapıya çeviren parça.

**Kendini yokla:** Tırnak ve girintiyi hangi araç düzenler; kullanılmayan değişkeni hangisi bulabilir?
*Cevap:* Tırnak ve girintiyi Prettier düzenler; ESLint seçilmiş kuralla kullanılmayan değişkeni bulabilir.

**Kendini yokla:** ESLint hatasızsa film detayının doğru filmi gösterdiğini kesin olarak biliyor musun?
*Cevap:* Hayır. ESLint yalnızca etkin kurallarının kaynakta sorun bulmadığını söyler; davranışı ayrıca test etmelisin.
