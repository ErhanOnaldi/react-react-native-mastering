---
title: "Sorgu önceliği ve erişilebilir ad"
minutes: 14
kind: concept
---

# Sorgu önceliği ve erişilebilir ad

:::pain[Problem]
Bir test `data-testid="search"` ile input’u buluyor ve geçiyor. Yeni formda yanlışlıkla etiketi silinmiş; klavye ile kullanan kişi alanı tanıyamıyor. Test, input’un varlığını gördü ama erişilebilir adının kaybolduğunu fark etmedi.
:::

## Bir sorgu aynı anda iki şeyi anlatır

3. modülün 10. dersinde `render`, `screen.getByRole` ve `userEvent` ile ilk bileşen testini kurdun. Bu ders sorgu temellerini tekrarlamaz; rol önceliğini, `name` eşleşmesini, `within` kapsamını ve `getBy`/`queryBy`/`findBy` farkını derinleştirir. Örneğin `getByRole('searchbox', { name: 'Katalogda ara' })` hem arama alanı istediğini hem doğru erişilebilir adın kullanıcıya sunulduğunu söyler.

Bir sorgunun başarısı, DOM’un bugünkü etiket ve yapısına değil, erişilebilir arayüze dayanmalıdır. RTL sorgularının öncelik sırası bu yüzden önemlidir. Önce kullanıcının erişebildiği rol ve ad; sonra görünür metin veya etiket; en son, başka güvenilir giriş noktası yoksa test id.

Kesin kurallar:

1. **Önce rolü belirle.** Buton için `button`, metin alanı için `textbox`, başlık için `heading`, durum duyurusu için `status` gibi kullanıcıya sunulan rolü seç.
2. **Birden fazla benzer öğe varsa `name` ile daralt.** `name`, çoğunlukla görünür metinden veya etiketten hesaplanan erişilebilir addır; testin doğru kontrolü bulduğunu gösterir.
3. **Sorgu varyantını beklentiye göre seç.** `getBy` bulunması gereken tek öğeyi hemen ister; `queryBy` yokluğu sınamak veya koşullu kontrol yapmak içindir; `findBy` öğenin daha sonra belirmesini bekler.
4. **Tekrar eden alanlarda arama alanını sınırla.** Bir bölüm ya da dialog içindeki sorguyu `within` ile yap; sayfadaki başka aynı adlı öğeleri yanlışlıkla seçme.
5. **`getByTestId` için gerekçe bul.** Erişilebilir rol, ad, etiket ve görünür metin bir öğeyi ayırt edemiyorsa test id kullanılabilir; test id erişilebilirlik denetimi değildir.

![Erişilebilirlik temelli RTL sorgu önceliği](diagrams/sorgu-onceligi.svg)

`getByRole` başarısızsa hata iletisi DOM’daki rolleri ve adları gösterir. Bu çıktı çoğu zaman sorgu mu yanlış, yoksa arayüz mü erişilebilir ad üretmiyor sorusunu ayırmana yardım eder. Hata mesajını körlemesine `getByText`’e geçerek çözme; önce DOM’da beklenen kontrol gerçekten nasıl adlandırılmış, onu kontrol et.

## Liste satırını daralt

Bir sayfada her kitap satırının içinde aynı “Detayı aç” düğmesi olduğunu düşün. `screen.getByRole('button', { name: 'Detayı aç' })` birden fazla eşleşme bulduğu için hata verir. Bu iyi bir hata: testin hangi satırı kastettiği belli değildir. Önce satırın erişilebilir kapsamını bulup aramayı onun içine al:

```tsx check
import { render, screen, within } from '@testing-library/react'
import '@testing-library/jest-dom/vitest'
import { expect, it } from 'vitest'

function Shelf() {
  return (
    <ul>
      <li>
        <h2>Göçebe</h2>
        <button>Detayı aç</button>
      </li>
      <li>
        <h2>İnce Memed</h2>
        <button>Detayı aç</button>
      </li>
    </ul>
  )
}

it('seçilen kitabın ayrıntı kontrolünü bulur', () => {
  render(<Shelf />)
  const row = screen.getByRole('listitem', { name: /İnce Memed/ })
  expect(within(row).getByRole('button', { name: 'Detayı aç' })).toBeInTheDocument()
})
```

Satırın kendisine erişilebilir ad verilmesi, örneğin başlık metninin `aria-labelledby` ile ilişkilendirilmesi gerekebilir. Uygulamanın semantiği buna uygun değilse testte `within` kullanmak tek başına eksik erişilebilirliği düzeltmez; gerektiğinde DOM semantiğini iyileştir. `within` sadece arama kökünü sınırlar, öğeyi erişilebilir yapmaz.

## Yanlış hedef önce, doğru hedef sonra

Aşağıdaki sorgu class adına bağlıdır ve label kaybolsa da alanı bulur:

```tsx
// Kırık: erişilebilir adın bozulmasını yakalamaz.
container.querySelector('.search-field')
```

Bir arama alanının etiketi `<label htmlFor="catalog-search">Katalogda ara</label>` ile input’a bağlı olsun. Doğru sorgu iki sözleşmeyi de belirtir:

```tsx check
import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom/vitest'
import { expect, it } from 'vitest'

function CatalogSearch() {
  return (
    <label htmlFor="catalog-search">
      Katalogda ara
      <input id="catalog-search" type="search" />
    </label>
  )
}

it('arama alanını erişilebilir adıyla sunar', () => {
  render(<CatalogSearch />)
  expect(screen.getByRole('searchbox', { name: 'Katalogda ara' })).toBeInTheDocument()
})
```

`name` seçenekleri tam eşleşme veya düzenli ifade kabul edebilir. Tam metin, kopyanın ürün sözleşmesi olduğu yerde nettir. Regex ise uzun dinamik adlarda veya yalnızca bir parçayı önemsediğinde yararlıdır. Regex’i gevşek kullanıp `name: /ara/i` yazarsan “Kitap ara”, “Yazar ara” ve “Sonuçlarda ara” öğelerinin hepsi eşleşebilir. Sorgunun fazla öğe bulması, testin hangi kontrolü istediğini daha açık yazman gerektiğini gösterir.

## Sorgu sırasını kullan

Bir kitap kaydı silinince toast mesajı DOM’dan kaldırılır. Yokluğun kendisi beklentiyse `queryByRole` kullanırsın; `getByRole` öğe yoksa assertion çalışmadan hata verir. Mesajın sunucudan sonra eklendiği durumda `findByRole` gerekir. Böylece niyet sorgunun içinde okunur:

| Kullanım | Zaman | Bulunmama davranışı | Uygun beklenti |
|---|---|---|---|
| `getByRole` | Anında | Hemen hata verir | Kontrol şu anda olmalı |
| `queryByRole` | Anında | `null` döner | Kontrol şu anda olmamalı |
| `findByRole` | Bekleyerek | Süre aşımında hata verir | Kontrol kısa süre sonra gelmeli |

Rol/ad sorgusu her öğe için en iyi seçenek değildir. Görünür, benzersiz ve anlamlı bir metin varsa `getByText` doğrudan olabilir. Form alanları için `getByLabelText`, placeholder dışında erişilebilir adı denetler. İkon düğmesinin görünür metni yoksa `aria-label` anlamlı bir ad sağlayabilir; test de bu adı doğrulayabilir. Ama testi geçirmek için `aria-label` eklemek, görünür etiketin tasarımsal olarak gerekli olduğu bir formda doğru çözüm olmayabilir.

:::mistake[Sık hata: `getBy` ile yokluğu aramak]
Belirti → Başlık kaldırıldığında test, “null değil” kontrolüne gelmeden `Unable to find` hatası verir.  
Neden → `getBy` öğenin bulunmasını zorunlu kılar.  
Düzeltme → Yokluğu `expect(screen.queryByRole(...)).not.toBeInTheDocument()` ile yaz.
:::

:::mistake[Sık hata: Belirsiz erişilebilir ad]
Belirti → Test sayfada ilk “Seç” düğmesini buluyor, ama yanlış satır üzerinde işlem yapıyor.  
Neden → Aynı ad birden fazla kontrolde kullanılıyor ve test kapsam belirtmiyor.  
Düzeltme → Önce ilgili satırı, kartı veya dialog’u bul; sonra `within` ile yerel sorgu yap. Mümkünse düğme adını eyleme göre özgünleştir.
:::

:::mistake[Sık hata: `data-testid` ile erişilebilirlik iddiası]
Belirti → Test id bulunuyor ama ekran okuyucu alanı isimsiz duyuruyor.  
Neden → Test id RTL’ye özgüdür, tarayıcı erişilebilirlik ağacına anlam eklemez.  
Düzeltme → Test id’yi arayüzde başka anlamlı sorgu yokken seç; erişilebilir ad için rol ve `name` kullan.
:::

## `name` hangi metni temsil eder?

Erişilebilir ad, öğenin türü değildir; öğenin kullanıcıya hangi isimle sunulduğunu anlatır. Bir düğmede çoğunlukla içindeki görünür metinden hesaplanır. Bir form alanında `<label>` ilişkisinden, bir `img` öğesinde `alt` metninden veya gerektiğinde `aria-label` değerinden gelir. `aria-labelledby`, başka bir DOM öğesinin metnini ad kaynağı yapabilir. Bu yüzden `name` seçeneği UI’ın erişilebilir isim hesabını da test eder.

Örneğin `<button aria-label="Paneli kapat"><svg ... /></button>` görünür metin taşımadığı halde “Paneli kapat” adıyla sorgulanabilir. Bu isim ikona anlam kazandırır; testin onu doğrulaması erişilebilirlik gereksinimidir. Buna karşılık görünür “Kapat” metni varken gereksiz bir `aria-label="Paneli kapat"` farklı isim üretebilir. Sorguda tahmini ismi kullanıp testi geçirmeye çalışma; DOM’un kullanıcıya sunduğu gerçek adı doğrula.

Regex ile `name` ararken eşleşmenin kapsamını düşün. `/rapor/i` başlıkta “Rapor”, düğmede “Raporu indir” ve linkte “Raporları gör” sonuçlarını kapsayabilir. `getAllByRole` kullanarak bilerek birden çok eşleşme bekliyorsan sayıyı da belirt; aksi halde özel isimle daralt. Bu, yalnız testin stabilitesi değil, arayüzün kullanıcıya belirsiz kontrol sunup sunmadığı konusunda da ipucudur.

`within` bir kartın içindeki yerel sorguyu sağlarken, kartın kendisine ulaşmanın da sağlam bir yolu gerekir. Herhangi bir `div`’e `role="group"` eklemek otomatik olarak iyi semantik yaratmaz. Gerçekten başlıkla ilişkili bir bölümse `<section aria-labelledby="...">` ya da doğal bir `<fieldset><legend>` gibi HTML semantiğini kullan. Testte scoping ihtiyacı göründüğünde önce arayüzdeki içerik gruplaması kullanıcı için anlamlı mı diye düşün.

:::sector
Ekipler tekrar eden eylemlere bağlama göre ad verir: “Ayşe Yılmaz’ı listeden çıkar” gibi. Bu isim hem ekran okuyucuya hedefi açıklar hem de testte kapsam arama ihtiyacını azaltır. Tasarım metni değiştiğinde testin kırılması, ürün sözleşmesi değiştiyse beklenen bir sinyaldir.
:::

## Özet

- Sorguyu önce rol, sonra erişilebilir adla kur.
- `getBy`, `queryBy` ve `findBy` arasındaki fark bulunma beklentisi ve zamanıdır.
- Yinelenen kontrolleri `within` ile yerel bir DOM kapsamına indir.
- Test id, erişilebilir ad yerine geçmez.
- Belirsiz sorgu testi zayıflatır; sorgu hedefi davranış kadar açık olmalıdır.

**Kendini yokla:** Henüz gelmemiş bir başlığı beklemek için hangi sorguyu seçersin?  
*Cevap:* `await screen.findByRole('heading', { name: ... })`.

**Kendini yokla:** Aynı ada sahip düğmeler iki kitap satırında varsa ne yaparsın?  
*Cevap:* İlgili satırı bulup `within(row)` ile düğmeyi o satırda ararım.
