---
title: "Sorgu önceliği ve erişilebilir ad"
minutes: 16
kind: concept
---

# Sorgu önceliği ve erişilebilir ad

Sinema kataloğunda arama alanının yanına “Oyuncu ara” diye bir yazı koyduğunu düşün. Bir test bu alanı yalnızca CSS class’ıyla bulursa yazı silinse bile test geçer. Oysa klavyeyle ya da ekran okuyucuyla kullanan kişi alanı tanıyamayabilir. Testin arayüzün kullanıcıya sunduğu kimliği de sorması gerekir.

## Alanı rolü ve adıyla bul

Bir öğenin `role` değeri onun kullanıcıya sunulan türünü söyler: örneğin düğme `button`, arama alanı `searchbox` rolündedir. `name` seçeneği öğenin erişilebilir adını belirtir; bu örnekte `<label>` metni input’a ad verir.

```tsx check
import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom/vitest'
import { expect, it } from 'vitest'

function CastSearch() {
  return (
    <label htmlFor="cast-search">
      Oyuncu ara
      <input id="cast-search" type="search" />
    </label>
  )
}

it('oyuncu arama alanını adıyla bulur', () => {
  render(<CastSearch />)
  expect(screen.getByRole('searchbox', { name: 'Oyuncu ara' })).toBeInTheDocument()
})
```

Sorgu hem doğru türde bir alan istediğimizi hem de “Oyuncu ara” adıyla sunulduğunu söyler. Etiket DOM’da duruyor ama input ile ilişkilendirilmemişse ad oluşmayabilir; test bunu görünür hale getirir. `data-testid` gibi bir işaret ise yalnızca test koduna bilgi verir ve erişilebilir isim sağlamaz.

![Erişilebilir arayüz sorgularında rol, ad ve sorgu önceliği](diagrams/sorgu-onceligi.svg "Erişilebilir arayüz sorgularında sorgu önceliği")

## Aynı adlı düğmeler varsa aramayı daralt

Film listesindeki her satırda “Fragmanı aç” düğmesi olabilir. Tek başına `getByRole('button', { name: 'Fragmanı aç' })` kullanırsan iki eşleşme bulunur ve sorgu hangisini kastettiğini bilemez. Önce film satırını seçip, sonra aramayı o satırda yapmak için `within` kullanırız.

```tsx check
import { render, screen, within } from '@testing-library/react'
import '@testing-library/jest-dom/vitest'
import { expect, it } from 'vitest'

function MovieShelf() {
  return (
    <ul>
      <li aria-label="Kayıp Balık">
        <h2>Kayıp Balık</h2>
        <button>Fragmanı aç</button>
      </li>
      <li aria-label="Uzak İstasyon">
        <h2>Uzak İstasyon</h2>
        <button>Fragmanı aç</button>
      </li>
    </ul>
  )
}

it('Uzak İstasyon satırındaki düğmeyi bulur', () => {
  render(<MovieShelf />)
  const row = screen.getByRole('listitem', { name: 'Uzak İstasyon' })
  expect(within(row).getByRole('button', { name: 'Fragmanı aç' })).toBeInTheDocument()
})
```

İlk sorgu doğru satırı belirler; `within(row)` sonraki sorgunun arama alanını o satırla sınırlar. `within` eksik semantiği düzeltmez: satırın anlamı HTML yapısından ve adından gelmelidir, gelişigüzel `div`-lere rol eklemek çözüm değildir. Burada `aria-label` satıra ad verir.

## Adın kaynağını anlaşılır kıl

Görünür bir etiketi olmayan ikon düğmesi varsa `aria-label` ile kısa ve eylemi anlatan bir ad verebilirsin. `aria-label`, yardımcı teknolojilere doğrudan bir isim sunan HTML özniteliğidir.

```tsx
function CloseTrailer() {
  return <button aria-label="Fragmanı kapat">×</button>
}
```

Ekranda yalnızca çarpı görünür, ama düğmenin adı “Fragmanı kapat” olur. Test de bu adı sorgulayabilir. Görünür bir etiket zaten varsa genellikle onu kullanmak daha iyi olur; `aria-label` yanlışlıkla görünür yazıdan farklı bir ad verirse arayüz tutarsızlaşır.

Başka bir öğenin metni ad olsun istersen `aria-labelledby` kullanabilirsin. Bu öznitelik, ad kaynağı olan öğenin `id`-sini işaret eder. Örneğin `section` bir film başlığının `id` değerini gösterirse bölümün adı o başlık olur. Form alanlarını görsel olarak gruplarken yerel HTML olan `<fieldset><legend>` de alan kümesine ve başlığına anlam verir; erişilebilir bir grup oluşturmak için bu doğal yapıyı tercih edebilirsin.

Erişilebilirlik ağacı, tarayıcının arayüzü yardımcı teknolojilere rol, ad ve durum bilgileriyle sunduğu yapıdır. `getByRole` ile ad aramak bu bilginin DOM’dan üretildiğini sınar; gerçek ekran okuyucunun sesi veya tüm cihazlardaki deneyim bu test ortamında çalıştırılmaz.

## Bulunma beklentisine göre sorguyu seç

Bir film başlığı ekranda şu anda varsa `getByRole` doğrudan bulur. Başlığın yokluğunu sınarken ise `queryByRole` kullanılır: öğe yoksa hata vermek yerine `null` döndürür. Böylece yokluk beklentisini yazabilirsin.

```tsx check
import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom/vitest'
import { expect, it } from 'vitest'

function TrailerStatus({ playing }: { playing: boolean }) {
  return playing ? <p role="status">Fragman oynatılıyor</p> : null
}

it('fragman başlamadan durum mesajı göstermez', () => {
  render(<TrailerStatus playing={false} />)
  expect(screen.queryByRole('status')).not.toBeInTheDocument()
})
```

`getBy` yokluğu hata sayar; `queryBy` yokluğu değer olarak verir. Bu nedenle bir başlık mutlaka görünmeli beklentisinde `getBy`, görünmemeli beklentisinde `queryBy` niyeti netleştirir. Aynı kontrolü hem var hem yok sayan belirsiz bir test yazmamak için beklentiye uygun olanı seç.

Öğrencinin sık yaptığı hata, yokluğu `getByRole` ile aramaktır. Belirti olarak assertion satırına gelmeden “Unable to find…” hatası görülür; nedeni `getBy` sorgusunun eşleşme bulmayı zorunlu tutmasıdır. Düzeltme `queryByRole` kullanıp sonucu bulunmuyor diye doğrulamaktır.

:::info[Derinlemesine (isteğe bağlı)]
`findByRole`, öğenin biraz sonra eklenmesini bekleyen asenkron sorgudur; `await` ile kullanılır. Asenkron beklemeyi sonraki derste işleyeceğiz. Sorgu ailesindeki `getAllBy`, `queryAllBy` ve `findAllBy` sürümleri bilerek birden çok eşleşme beklediğinde kullanılır.
:::

## Örnekleri birleştirirken hata ayıkla

Test `getByRole('button', { name: 'Oynat' })` ile düğmeyi bulamıyorsa hemen `getByText` veya test id’ye geçme. Önce DOM’da düğmenin rolü ne, erişilebilir adı ne diye bak. Ad beklediğinden farklıysa HTML etiketini veya `aria-label`/`aria-labelledby` bağlantısını düzeltmek gerekebilir.

Birden fazla “Oynat” düğmesi bulunursa sorgunun fazla öğe bulduğunu fark edersin. Önce doğru filmi rol ve adıyla belirle, sonra `within` ile onun düğmesini ara. Bu yaklaşım hem testi doğru hedefe götürür hem de uygulamanın kullanıcıya yeterli bağlam verip vermediğini düşünmeni sağlar.

## Özet

- Kontrolü önce rolüyle, sonra erişilebilir adıyla bul; sorgu aynı zamanda arayüzün anlaşılır olup olmadığını gösterir.
- Aynı adlı öğeler tekrar ediyorsa anlamlı satırı bul ve `within` ile aramayı daralt.
- `getBy` mevcut olmayı, `queryBy` yokluğu kontrol etmeyi anlatır; `findBy` asenkron bekler.
- `aria-label`, `aria-labelledby` ve `<fieldset><legend>` ad/grup bilgisini HTML’den yardımcı teknolojilere aktarır.

**Yeni terimler**

- **Role:** Kontrolün erişilebilir arayüzdeki türü; örneğin `button` veya `searchbox`.
- **Erişilebilir ad:** Kontrolün yardımcı teknolojilere sunulan ismi.
- **Erişilebilirlik ağacı:** Tarayıcının rol, ad ve durum bilgisini yardımcı teknolojilere sunduğu yapı.
- **`aria-label`:** Öğe için doğrudan erişilebilir ad veren öznitelik.
- **`aria-labelledby`:** Başka bir öğenin metnini erişilebilir ad olarak kullandıran öznitelik.

**Kendini yokla:** Ekranda bulunmaması gereken `status` mesajını hangi sorguyla ararsın?
*Cevap:* `queryByRole('status')`; öğe yoksa `null` döndürür.

**Kendini yokla:** İki film satırında da “Fragmanı aç” varsa yanlış satırdaki düğmeyi seçmemek için ne yaparsın?
*Cevap:* Önce filmi bulur, ardından `within(filmSatiri)` ile düğmeyi o kapsamda ararım.
