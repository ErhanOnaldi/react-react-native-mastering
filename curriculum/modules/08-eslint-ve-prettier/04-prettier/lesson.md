---
title: "Prettier biçim kararlarını paylaşır"
minutes: 14
kind: concept
---

# Prettier biçim kararlarını paylaşır

:::pain[Problem]
Sinema’daki aynı bileşen senin bilgisayarında çift tırnak, noktalı virgül ve iki boşlukla; ekip arkadaşının editöründe tek tırnak, noktalı virgülsüz ve farklı satır kırımlarıyla kaydediliyor. Pull request’te davranış değişikliği birkaç satır, geri kalanı biçim gürültüsü. Değişikliğin ne yaptığını okumak zorlaşıyor.
:::

## Görünüş için tek karar kaynağı

Prettier kaynak kodu parser ile okur ve belirlediğin seçeneklere göre yeniden yazar. Satırları nereden kıracağını, tırnak tercihini, girintiyi ve noktalı virgülü düzenler. Kodun doğru çalışıp çalışmadığına karar vermez. Aynı kaynak ve aynı seçeneklerle çalıştırıldığında ekip üyelerinin aynı görünüşü elde etmesini sağlar.

Bu araç sınırını ESLint’ten ayrı tut. ESLint mantıksal kod kurallarını ve React Hook ilişkilerini inceler. Prettier kaynak metnin görünüşünü düzenler. TypeScript tipleri denetler. Bunlardan birinin başarılı olması diğerinin işini yaptığı anlamına gelmez. Özellikle Prettier’ın kodu yeniden yazması, yeni biçimde davranış hatası olmadığını kanıtlamaz.

Bir `.prettierrc.json` dosyası ekip tercihini repoda tutar. `singleQuote`, `semi` ve `printWidth` sık kullanılan seçeneklerdir. `printWidth` katı satır kesme sınırı değil, satır uzunluğunu hedefleyen bir tercihtir; tek parça bölünemeyen metin daha uzun kalabilir. Her seçenek için varsayılanı tekrar yazmak zorunlu değildir; ekipte karara bağlanmış farklı tercihleri açık et.

## Biçim akışını adım adım izle

Geliştirici bir dosyayı kaydediyor ve Prettier yapılandırması `singleQuote: true`, `semi: false` diyor:

| Aşama | Girdi/karar | Prettier’ın yaptığı | Kod anlamı |
| --- | --- | --- | --- |
| 1 | `const label = "Hazır";` | Kaynak metni TypeScript olarak ayrıştırır | Henüz çalışma yok |
| 2 | Tek tırnak tercihi etkin | String ayıracını `'Hazır'` yapar | Aynı string değeri |
| 3 | `semi: false` etkin | Sondaki `;` karakterini kaldırır | Aynı ifadeyi temsil eder |
| 4 | Dosya yeniden yazılır | Çıktı config’in tercihine eşitlenir | Uygulama henüz test edilmedi |
| 5 | `--check` çalışır | Dosyanın beklenen çıktıyla eşleşmesini denetler | Fark varsa komut başarısız olur |

`--write` dosyayı gerçekten değiştirir. `--check` biçimi denetler ve düzeltilmesi gereken dosyaları bildirir. CI’da kontrol modunu kullanmak, makinenin commit içeriğini sessizce değiştirmesini önler. Geliştirici yerelde `--write` ile düzeltir, farkı gözden geçirir ve tekrar kontrol eder.

Bir biçim değişikliğinin büyük diff üretmesi her zaman kodun tamamının yeniden yazıldığı anlamına gelmez. Eski dosya farklı bir Prettier sürümü ya da seçenekle kaydedilmiş olabilir. Araç sürümü ve config değişince bütün dosyaları bir defada biçimlemek ayrı, yeni özellik geliştirirken yalnız değişen dosyayı biçimlemek ayrı kararlardır. Büyük bir biçim göçü yapacaksan onu mantıksal kod değişikliğinden ayrı commit etmek review’ı kolaylaştırır.

Formatter’ın sonucu kararlı tutmak için ekipte sürüm yönetimini de düşün. Aynı config, farklı formatter sürümleri arasında nadiren farklı satır kararı verebilir. Proje bağımlılıklarında sürümü sabitlemek veya lockfile üzerinden yüklemek, editörün global kurulumuna güvenmekten daha tekrarlanabilir sonuç verir. Editör entegrasyonunda “workspace version” seçmek, terminaldeki proje sürümünü kullanmasına yardım eder.

## Kırık, sonra ortak biçim

İki geliştiricinin aynı kodu farklı yazdığını düşün:

```ts title="Kırık biçim"
const label = "Hazır";
const details = {name:"Kıyı", active:true};
```

Burada amaç değeri ya da nesnenin alanlarını değiştirmek değil, aynı kararları her geliştiricide aynı görünüşe getirmektir. `prettier.format` API’si asenkrondur ve parser seçimi gerekir. Aşağıdaki tek başına derlenebilir örnek, kaynak metni seçilen tercihlere göre döndürür:

```ts check
import * as prettier from 'prettier'

const source = 'const label = "Hazır";\n'

const output = await prettier.format(source, {
  parser: 'typescript',
  singleQuote: true,
  semi: false,
  printWidth: 80,
})

console.log(output)
```

Çıktı şöyledir:

```ts
const label = 'Hazır'
const details = { name: 'Kıyı', active: true }
```

Değer ve nesne alanları korunur, tırnak ve noktalı virgül tercihi değişir. Dizi veya nesne uzunsa Prettier satırları okunabilir bir yerden bölebilir. En geniş satırı zorla kesmesi için `printWidth`’ü güvence gibi görme; string’i ortasından bölmek kod anlamını değiştirebilir.

## Tailwind class sırası

Tailwind sınıfları HTML içinde görünüş kararlarını biriktirir. `prettier-plugin-tailwindcss` bu class’ları önerilen sıraya dizer; hangi sınıfın stilini geçersiz kıldığını tek başına çözmez ve hatalı class adı için CSS üretmez. Plugin’i `.prettierrc.json` içinde yükleyip Tailwind v4 kaynak CSS dosyasını `tailwindStylesheet` seçeneğiyle göstermek gerekir. Bu repo için dosya yolu `./src/index.css` olur ve config’in bulunduğu klasöre göre çözülür.

```json title=".prettierrc.json"
{
  "singleQuote": true,
  "semi": false,
  "plugins": ["prettier-plugin-tailwindcss"],
  "tailwindStylesheet": "./src/index.css"
}
```

Bir JSX class string’i plugin ile sıraya girebilir. Plugin devre dışıysa Prettier yine diğer dosya biçimini düzenler; yalnız class sıralaması değişmeden kalır. Projede plugin’i bir yerde kurup başka ortamda config’ten unutmak da aynı tutarsızlığı doğurur. Config’in depoda olması ve geliştirici makinesinde paketlerin bulunması birlikte gerekir.

Tailwind class sıralaması genel CSS cascade’inin davranışını değiştirmemeli; plugin yalnız string içindeki utility’leri tanımlı sıralama kararına göre taşır. Aynı element üzerinde çelişen utility’ler varsa class’ı yeniden sıralamak her zaman beklediğin görsel sonucu garanti etmez; Tailwind’in üretim sırası, variant ve utility ilişkileri ayrıca önemlidir. Çakışan sınıfı temizlemek veya birleştirmek başka bir tasarım kararıdır. Prettier’a sınıf çakışması çözücüsü rolü verme.

Plugin ayarı yanlış dosyaya bağlanırsa sınıfların bir kısmı tanınmayabilir. Tailwind v4’te tema ve özel utility tanımları CSS merkezlidir; bu nedenle plugin eski JS config’ini aramamalıdır. Bir monorepo’da her app’in farklı stylesheet’i varsa, her app’in config’i kendi CSS yolunu göstermelidir. Yolun doğru olduğunu önce kısa bir JSX örneğinde dene, sonra tüm projeyi biçimlendir.

JSON config’inde string ve boolean değerleri geçerli JSON olmalıdır; yorum veya sondaki virgül her tool’da kabul edileceğini varsayma. `.prettierrc.json` sade ayar dosyasıdır. Eğer config’i JavaScript olarak yazarsan executable config yolu da mümkündür, ancak bu projede JSON kullanmak tercihleri gözden geçirmeyi kolaylaştırır. Ignore dosyası da git ignore’dan bağımsızdır: bir yolu `.gitignore`’a eklemek onu Prettier’dan mutlaka çıkarmaz.

## ESLint ile çakışmayı çöz

ESLint’te biçimle ilgili kurallar açık olabilir. Prettier aynı dosyayı farklı bir tercihle yazdığında iki araç aynı satır için zıt sonuç isteyebilir. `eslint-config-prettier/flat`, ESLint’in Prettier ile çakışan biçim kurallarını kapatmak için flat config dizisinin sonuna eklenir. Prettier komutunu çağırmaz; yalnız lint katmanındaki çakışmaları kaldırır.

İki aracı tek bir “code quality” düğmesinde çalıştırmak isteyen script yazabilirsin; yine de çıktıları ayrı tut. Lint error’ı kaynak kuralını, format check farkı görünüş kararını anlatır. Ayrım, bir CI hatasını çözmek için doğru komuta yönelmeyi kolaylaştırır.

## Sık hatalar

:::mistake[CI dosyaları kendisi değiştiriyor]
Belirti → CI çalışınca çalışma alanında dosyalar güncelleniyor, ama hangi değişikliklerin commit edileceği belli değil. Neden → Otomatik yazma komutu kontrol kapısında kullanıldı. Düzeltme → CI’da `prettier --check` çalıştır; geliştirici yerelde `prettier --write` çalıştırıp farkı incelesin.
:::

:::mistake[Print width kesin sınır sanılıyor]
Belirti → Uzun tek satırlık URL ya da string 80 karakteri aşıyor. Neden → `printWidth` hedef uzunluktur, her token’ı bölebilen sert bir kesme emri değildir. Düzeltme → Bölünmesi güvenli ifadeleri düzenle; bölünemeyen literal değer için aşırı uzunluk olabileceğini kabul et.
:::

:::mistake[Tailwind eklentisi stylesheet bulamıyor]
Belirti → Class sırası değişmiyor veya plugin hata veriyor. Neden → `tailwindStylesheet` yolu yanlış klasöre göre yazılmış ya da v4 CSS dosyasını göstermiyor. Düzeltme → Config’in konumundan `./src/index.css` yolunu doğrula ve plugin’in config’te yüklü olduğunu kontrol et.
:::

:::sector
Ekiplerin önemli kazancı PR’da biçim tartışmasını azaltmak ve diff’i davranış değişikliğine ayırmaktır. Birçok takım kaydederken otomatik biçimleme açar, fakat CI’da salt kontrol çalıştırır. Böylece yerel editör ayarı ortak config’i kullanır, ana dala giden içerik yine denetlenebilir kalır.
:::

## Özet

- Prettier kodu parser üzerinden ortak görünüş kurallarıyla yeniden yazar.
- `--write` düzeltir; `--check` biçim farkını raporlar.
- `printWidth` hedef uzunluktur; sert karakter sınırı değildir.
- Tailwind v4 plugin’ine `tailwindStylesheet` ile kaynak CSS yolu verilir.
- ESLint’in format kuralları `eslint-config-prettier/flat` ile çakışmadan çıkarılır.

**Kendini yokla:** Dosyanın biçim farkını CI’da göstermek için hangi komut türünü seçersin?
*Cevap:* Değişiklik yapmayan `prettier --check` komutunu.

**Kendini yokla:** Prettier’dan sonra neden testleri yine çalıştırmak gerekir?
*Cevap:* Biçim aracı uygulama davranışının doğru olduğunu kanıtlamaz.
