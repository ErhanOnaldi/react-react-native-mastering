---
title: "Aynı kuralı veri tablosuyla sınayalım"
minutes: 15
kind: concept
---

# Aynı kuralı veri tablosuyla sınayalım

Sinema’da bir filmin etiketini hazırlayan küçük bir fonksiyon düşün: başlık ve çıkış tarihi alıyor, ekranda gösterilecek yazıyı döndürüyor. Bu fonksiyonu önceki derslerdeki gibi tek bir örnekle test edebilirsin. Peki boş tarih, normal tarih ve sıfır koltuk gibi farklı girişlerde aynı kuralın çalıştığını nasıl görürsün?

## Önce tek bir örneği sınayalım

Vitest’te `it` bir test tanımlar. İçindeki `expect(...).toBe(...)` ise bir **assertion**’dır: gerçek sonucu beklediğin değerle karşılaştırır ve fark varsa testi başarısız yapar.

```ts check
import { expect, it } from 'vitest'

function runtimeLabel(minutes: number): string {
  return `${Math.floor(minutes / 60)} sa ${minutes % 60} dk`
}

it('iki saatlik filmin süresini yazar', () => {
  expect(runtimeLabel(120)).toBe('2 sa 0 dk')
})
```

Bu test yalnızca bir girdi çalıştırır: 120 dakika. Fonksiyon saati ve kalan dakikayı yazıya çevirir; henüz kısa bir filmin ya da 0 dakikanın etiketini görmedik. İkinci test yazabiliriz ama test gövdeleri birbirine çok benzeyecek.

:::model[Testin anatomisi]
Her testte girdiyi hazırla, davranışı çalıştır ve sonucu doğrula. `it.each` aynı akışı her veri satırına uygular.

![Testin hazırla, çalıştır, doğrula akışı](diagram:test-anatomisi)
:::

## Bir test, iki veri satırı

**Tuple tablosu**, her satırında sıralı değerler bulunan küçük bir dizidir; burada ilk sütun girdi, ikinci sütun beklenen sonuç olacak. Vitest’in `it.each` aracı her tuple’ı aynı callback’e sırayla verir ve her satır için ayrı test sonucu raporlar.

![Her veri satırının aynı kurala gidip ayrı sonuç vermesi](diagrams/veri-tablosu.svg)

```ts check
import { expect, it } from 'vitest'

function runtimeLabel(minutes: number): string {
  return `${Math.floor(minutes / 60)} sa ${minutes % 60} dk`
}

it.each([
  [95, '1 sa 35 dk'],
  [120, '2 sa 0 dk'],
])('%i dakika için %s yazar', (minutes, label) => {
  expect(runtimeLabel(minutes)).toBe(label)
})
```

İlk satırda `minutes` 95, beklenen etiket “1 sa 35 dk” olur; ikinci satırda aynı callback 120 değerini alır. İki satır, iki ayrı raporlanan sonuç demektir. Fonksiyonu ya da assertion’ı kopyalamadan iki süreyi de kontrol ettik.

## Her satırı sırayla izleyelim

Bir salonun kapasitesini yazıya çeviren kuralı biraz büyütelim: kapasite bilinmiyorsa “Kapasite yok”, sayı varsa “N koltuk” gösterilsin.

```ts check
import { expect, it } from 'vitest'

function seatLabel(count: number | undefined): string {
  return count === undefined ? 'Kapasite yok' : `${count} koltuk`
}

it.each([
  [undefined, 'Kapasite yok'],
  [0, '0 koltuk'],
  [120, '120 koltuk'],
])('%s kapasite için %s yazar', (count, expected) => {
  expect(seatLabel(count)).toBe(expected)
})
```

`it.each` satırları şu sırayla yürütür:

| Satır | `count` | Fonksiyon sonucu | Assertion neyi karşılaştırır? |
| --- | --- | --- | --- |
| 1 | `undefined` | `Kapasite yok` | Sonuç, beklenen yazıya eşit mi? |
| 2 | `0` | `0 koltuk` | Sonuç, beklenen yazıya eşit mi? |
| 3 | `120` | `120 koltuk` | Sonuç, beklenen yazıya eşit mi? |

Sıfır satırı özellikle işe yarar: JavaScript’te `0` falsy’dir; yani koşul içinde `false` gibi davranır. Fonksiyon `if (!count)` diye yazılsaydı 0 kapasiteyi “bilinmiyor” sanabilirdi. Her satırın sonucu ayrı olduğu için rapor hangi kapasite örneğinin bozulduğunu gösterir.

## Tabloyu başlığa ve kurala göre seç

Test başlığındaki `%s` ve `%i`, Vitest’in başlığa ilgili değeri yazması için kullanılan yer tutuculardır. `%s` metin, `%i` tam sayı gösterir. Bir örnek kalınca başlıkta hangi girdinin başarısız olduğunu görmen, tabloyu yeniden açıp satır aramaktan daha hızlıdır.

Örneğin elle kopyalanan testlerde aynı başlık iki kez kalabilir:

```ts
it('kapasiteyi biçimlendirir', () => {
  expect(seatLabel(0)).toBe('0 koltuk')
})
it('kapasiteyi biçimlendirir', () => {
  expect(seatLabel(120)).toBe('120 koltuk')
})
```

İkisi de “kapasiteyi biçimlendirir” derse hata raporunda hangi girdinin bozulduğu belirsizleşir. Aynı iki örneği `%i` kullanan tabloya aldığında hem ortak kural görünür hem de `0` veya `120` başlığa yazılır. Beklenen değerleri yine sen iş kuralından çıkarırsın; tablo yanlış beklentiyi doğru yapmaz.

Şimdi aynı yaklaşımı Sinema’daki film kartı rozetine uygulayalım. Bu üçüncü örnekte her satırda film nesnesi ve beklenen rozet var; seçili film “Öne çıkan” rozeti alıyor, diğer film kendi adını koruyor.

```ts check
import { expect, it } from 'vitest'

type Movie = { title: string; featured: boolean }

function filmBadge(movie: Movie): string {
  return movie.featured ? `Öne çıkan: ${movie.title}` : movie.title
}

it.each([
  [{ title: 'Sessiz Şehir', featured: true }, 'Öne çıkan: Sessiz Şehir'],
  [{ title: 'Kayıp Harita', featured: false }, 'Kayıp Harita'],
])('%j filmi için %s rozetini üretir', (movie, expected) => {
  expect(filmBadge(movie)).toBe(expected)
})
```

İki satır da aynı fonksiyonu ve aynı string karşılaştırmasını kullanıyor. İlk satır rozetin eklendiğini, ikincisi rozet gerekmiyorsa film adının değişmediğini gösteriyor. Böylece tablo, görevlerdeki işten farklı bir Sinema davranışında da aynı fikri kullanıyor.

## Gerçekten aynı davranış mı?

Bir tabloya satır eklemeden önce şunu sor: “Bu satır aynı fonksiyonun aynı kuralını mı sınayacak?” Boş tarih, geçerli tarih ve sınırdaki tarih aynı yıl çıkarma kuralının farklı durumları olabilir. Buna karşılık biri URL parametresini, diğeri storage’a yazılan anahtarı doğruluyorsa ortak tablo biçimine uysalar da ayrı davranışlardır.

Tabloyu karar noktalarından kur. Her olası tarihi eklemek kapsamı otomatik olarak iyileştirmez; boş, normal ve iş kuralının ayırdığı bir sınır çoğu kez daha anlamlıdır. Örneklerin hepsi dolu ve benzer biçimdeyse boş tarih hatası hâlâ kaçabilir.

:::mistake[Birbirinden farklı işleri tek tabloda toplamak]
Belirti: Callback içinde “bu satır URL’yi, şu satır storage’ı kontrol etsin” gibi dallar oluşur. → Neden: Tablo biçiminin ortak olması, davranışın da ortak olduğu anlamına gelmez. → Düzeltme: Her farklı gereksinim için ayrı test adı ve gövdesi kullan.
:::

:::mistake[Her satıra aynı genel başlığı vermek]
Belirti: Bir satır kalır ama hangi girdi olduğu raporda görünmez. → Neden: Başlık girdiyi ya da kısa açıklayıcı etiketi göstermiyordur. → Düzeltme: `%s` veya `%i` ekle; karmaşık girdide kısa bir label kullan.
:::

## TypeScript tablosunu sade tut

`it.each` için satırları tuple olarak yazmak basit örneklerde yeterlidir. Girdiler farklı tiplerde olduğunda TypeScript callback parametrelerinin tipini beklediğinden geniş çıkarabilir. Önce tablonun okunur olup olmadığına bak; sırf tablo kullandın diye gelişmiş tip eklemek gerekmez.

```ts
const cases = [
  ['2001-04-20', '2001'],
  ['', ''],
] as const
```

`as const`, TypeScript’in bu değerleri genel `string[]` gibi genişletmek yerine yazıldıkları sabit değerler olarak korumasını ister. Bu ayrıntı basit tabloda çoğu zaman gereksizdir; callback’in tipi gerçekten sorun çıkarırsa satır tipini açıkça tanımlamayı da düşünebilirsin.

:::info[Derinlemesine (isteğe bağlı)]
`as const` ile sabitlemenin ileri tip durumları bu dersin gereği değil. Property-based testing, tek tek elle seçilen satırlar yerine bir kural üreterek çok sayıda girdiyi sınama yaklaşımıdır; burada önce anlamlı temsilci örnekleri seçiyoruz.
:::

## Özet

- `it.each` aynı callback’i veri tablosundaki her satır için ayrı test sonucu olarak çalıştırır.
- Tuple satırında sütun sırası callback parametrelerinin sırasıyla eşleşir.
- Tablo aynı davranış kuralının farklı girdilerini sınar; farklı işleri birleştirme.
- Boş değer ve `0` gibi sınırlar, normal bir örneğin göstermediği hataları açığa çıkarabilir.
- Başlık girdiyi gösterirse başarısız satırı raporda bulmak kolaylaşır.

**Yeni terimler:**

- **Assertion:** Gerçek sonucu beklenen değerle karşılaştıran doğrulama.
- **Tuple tablosu:** Her satırında sıralı girdi ve beklenen değerler bulunan veri dizisi.
- **`it.each`:** Tablo satırlarını ayrı test sonuçları olarak çalıştıran Vitest aracı.
- **Yer tutucu (`%s`, `%i`):** Başlıkta test girdisini göstermek için kullanılan işaret.

**Kendini yokla:** Tablodaki üç satırdan biri kalırsa kaç test sonucu raporlanır? Her satır ayrı çalıştığı için başarısız olan tek satır görünür.

**Kendini yokla:** Storage anahtarını doğrulayan bir satırı yıl biçimlendirme tablosuna koyar mısın? Hayır; farklı davranışları ayrı testlerde tutarsın.
