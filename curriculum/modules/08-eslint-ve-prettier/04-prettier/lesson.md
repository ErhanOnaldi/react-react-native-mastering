---
title: "Prettier biçim kararlarını paylaşır"
minutes: 15
kind: concept
---

# Prettier biçim kararlarını paylaşır

Sinema'da bir film başlığını string olarak yazabiliyorsun. Aynı değer çift tırnakla da tek tırnakla da yazılabilir; ama iki tercih aynı dosyada karışınca kodu okumak zorlaşır. Prettier, kaynak kodun görünüşünü ortak kararlara göre düzenleyen bir **formatter**'dır (biçimleyici). Uygulamanın doğru çalıştığını denetlemez; insanların kodu benzer biçimde görmesine yardım eder.

## Aynı değer, iki görünüş

İlk örnekte yalnızca bir başlık var:

```ts
const filmTitle = "Kıyı";
```

Projenin biçim tercihi tek tırnaksa Prettier bu satırı `'Kıyı'` biçiminde yazar. String'in değeri yine `Kıyı` olur; araç değişkenin ne tuttuğunu değiştirmeden yazım biçimini düzenler. Bu küçük fark önemlidir: formatter'ın işi kodu yeniden tasarlamak ya da değişkenleri çözmek değil, seçilmiş görünüş kararlarını tutarlı uygulamaktır.

Şimdi aynı kararı bir nesneye uygula:

```ts
const film = {title:"Kıyı", year:2024};
```

Prettier boşlukları ekler ve ayara göre string tırnağını düzenler:

```ts
const film = { title: 'Kıyı', year: 2024 }
```

Alan adları, değerler ve nesnenin anlamı aynı kaldı; yalnızca boşluk, tırnak ve satır sonu görünüşü değişti. Bir dosyayı elle biçimlemek yerine araca vermen, aynı tercihi her nesnede yeniden düşünme yükünü azaltır.

## Tercihi proje dosyasına koy

Bir **config** (yapılandırma), aracın hangi ayarlarla çalışacağını söyleyen dosyadır. Tercihleri repoda tutarsan Sinema'yı açan herkes aynı kararı kullanabilir. Aşağıdaki örnekte yalnızca string tırnağı ve noktalı virgül tercihi yeni; `printWidth` ise satırları düzenlerken hedeflenen yaklaşık genişliktir.

```json title=".prettierrc.json"
{
  "singleQuote": true,
  "semi": false,
  "printWidth": 80
}
```

Config'teki `parser` ayarı, Prettier'a dosyanın hangi dilin sözdizimiyle yazıldığını söyler. TypeScript kaynakları için `typescript` parser'ı seçilir; böylece araç TypeScript kodunu doğru kurallarla okuyup biçimlendirebilir. Parser biçimlendirme tercihi değildir: dosyadaki string'in tek tırnak mı çift tırnak mı olacağını `singleQuote` belirler.

Bu ayarlarla bir film kartının başlığı ve özeti şöyle görünebilir:

```tsx
function FilmCard() {
  const title = 'Kıyı'
  const summary = 'Bir ailenin sahil kasabasındaki yazı.'

  return <article>{title}: {summary}</article>
}
```

Prettier burada tercih edilen tırnak ve satır sonlarını korur; uzun JSX ifadesini okunabilir bir noktadan bölebilir. `printWidth: 80` katı bir kesme çizgisi değildir: Prettier satırı bölmenin kod anlamını değiştireceği durumlarda 80 karakteri aşabilir. Bu yüzden uzun bir URL'nin ya da tek bir string'in mutlaka kesileceğini bekleme.

## Yazmak ile denetlemek arasındaki fark

Sinema'da başlık listesini düzenlerken dosyayı biçimlemek isteyebilirsin. `--write` dosyanın içeriğini değiştirir; `--check` ise dosyaya dokunmadan beklenen biçimle karşılaştırır. Aşağıdaki adımları sırayla düşün:

| Adım | Komut veya karar | Ne olur? | Kodun çalışma sonucu bilinir mi? |
| --- | --- | --- | --- |
| 1 | Dosyada çift tırnak ve `;` var | Mevcut metin okunur | Hayır |
| 2 | `prettier --write src/FilmList.tsx` | Prettier biçimi uygular ve dosyayı yazar | Hayır |
| 3 | Dosyadaki farkı incelersin | Hangi satırların değiştiğini görürsün | Hayır |
| 4 | `prettier --check src/FilmList.tsx` | Biçim tercihlerine uyumu denetler | Hayır |
| 5 | Test veya uygulama kontrolü yapılır | Davranış ayrıca sınanır | Evet, yalnız bu kontrollerin kapsadığı ölçüde |

Örneğin `--write` sonrası şu ifade değişmiş olsun:

```ts
const heading = "Kıyı";
```

```ts
const heading = 'Kıyı'
```

Prettier dosyayı ortak biçime getirdi; bu değişiklik fonksiyonun beklenen başlığı verdiğini kanıtlamaz. `--check` de yalnızca dosyanın biçim farkı olup olmadığını söyler. Bu iki ayrı komut, yerelde düzeltme yapmayı ve CI'da (kod değişikliğini sunucuda denetleyen otomatik iş) değişiklik yapmadan kontrol etmeyi mümkün kılar.

## Üçüncü örnek: biçim JSX'e de uygulanır

Film başlığını bir JSX listesinde gösterdiğini varsay:

```tsx
const film = { title: 'Kıyı', year: 2024 }
const card = <article><h2>{film.title}</h2><p>{film.year}</p></article>
```

Prettier JSX'i de düzenleyebilir:

```tsx
const film = { title: 'Kıyı', year: 2024 }
const card = (
  <article>
    <h2>{film.title}</h2>
    <p>{film.year}</p>
  </article>
)
```

JSX ifadesi birden çok satıra yayıldı; başlık ve yılın ne olduğu değişmedi. Böylece örnekler tek değerden nesneye, oradan JSX'e ilerledi: aynı biçim kararları farklı kod parçalarında da çalışıyor.

Formatter'ı çalıştırmak, uygulama kodunu **parse** etmekten (kaynak metni kod yapısı olarak okumaktan) geçer; parser bu sayede string ile noktalama işaretini ayırt edebilir. Bu işlem tip denetimi veya davranış testi değildir. ESLint seçilmiş kod kurallarını, TypeScript tip ilişkilerini, testler ise yazılan senaryolardaki davranışı inceler. Bir aracın başarılı olması diğer kontrollerin yerine geçmez.

## Gerçek hata: satır genişliğini sınır sanmak

`printWidth` 80 iken uzun bir film adresinin 80 karakteri geçtiğini görebilirsin. Belirti, dosyada 80'i geçen bir satır kalmasıdır. Sebep, bu ayarın her satırı kesen sert bir sınır değil, Prettier'ın satır düzenlerken dikkate aldığı hedef olmasıdır. Güvenli bir ifade bölünebiliyorsa araç satır kırabilir; tek string'i ortadan bölmek değeri değiştirir, bu yüzden bunu zorlamaz.

İkinci yaygın yanlış, CI'da `--write` çalıştırmaktır. O zaman sunucu dosyaları düzeltmeye çalışır, ama bu yeni içerik commit'inde bulunmaz. CI'da `--check` kullan; farkı yerelde `--write` ile düzelt ve değişikliği gözden geçir.

## Sınırı bil: biçim, lint ve Tailwind

ESLint bazı biçim kurallarını da içerebilir. Bu kurallar Prettier tercihleriyle çatışıyorsa biri tek tırnak, diğeri çift tırnak isteyebilir. `eslint-config-prettier/flat`, ESLint'in çakışan biçim kurallarını kapatır; Prettier'ı çalıştırmaz. Böylece lint kuralı ile biçimleme işi ayrı kalır.

:::info[Derinlemesine (isteğe bağlı)]
Tailwind kullanan projelerde `prettier-plugin-tailwindcss` class adlarını ortak bir sıraya dizer. Bir **plugin**, araca ek özellik kazandıran pakettir. Tailwind v4 projesinde `tailwindStylesheet` ayarıyla kaynak CSS dosyası gösterilir; plugin class çakışmalarını çözmez ve hatalı class için CSS üretmez. CSS'in **cascade** düzeni, aynı elemana uygulanan stillerin hangisinin baskın olacağını belirler; class sırasını değiştirmek her çakışmayı çözmez. Repo içinde config'in ve plugin paketinin birlikte bulunması gerekir.

Projenin farklı uygulamaları ayrı CSS kaynakları kullanıyorsa config yolu her uygulama için ayrıca düşünülmelidir. Ayrıca aynı config'i farklı Prettier sürümleri çalıştırabilir; proje sürümünü sabitlemek sonucu daha tekrarlanabilir yapar. Bunlar temel biçim kararını kullanmak için değil, proje büyüyünce tutarlılığı korumak için önem kazanır.
:::

## Özet

- Prettier, kodun görünüşünü ortak tercihlere göre düzenler; davranışı doğrulamaz.
- `.prettierrc.json` tercihleri repoda paylaşır; `printWidth` yaklaşık satır hedefidir.
- `--write` dosyayı düzeltir, `--check` dosyaya dokunmadan farkı bildirir.
- Lint, tip denetimi ve testler farklı sorulara cevap verir; biçim kontrolü onların yerine geçmez.

**Yeni terimler:** formatter — kod görünüşünü düzenleyen araç; config — aracın ayar dosyası; parser — kaynak metni kod yapısı olarak okuyan bölüm; `printWidth` — Prettier'ın satır uzunluğu için kullandığı hedef; CI — kodu sunucuda otomatik denetleyen süreç.

**Kendini yokla:** CI biçim farkını raporlayacaksa hangi komut seçeneği uygundur?
*Cevap:* `--check`; çünkü dosyayı değiştirmeden farkı bildirir.

**Kendini yokla:** `printWidth` 80 iken uzun bir string neden 80 karakterde kesilmeyebilir?
*Cevap:* Bu kesin sınır değil hedeftir; string'i kesmek değerini değiştirebilir.
