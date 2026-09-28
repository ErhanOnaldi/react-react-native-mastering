---
title: "Bileşeni kullanıcı gibi test et"
minutes: 15
kind: concept
---

# Bileşeni kullanıcı gibi test et

:::pain[Problem]
Sinema’daki favori düğmesi tıklanınca ekrandaki yazı değişiyor, ama klavyeyle kullanan biri düğmeyi bulamıyor. Test yalnızca bileşenin içindeki `saved` değişkenini denetlediği için bu sorun yeşil sonuçların arkasında kalıyor.
:::

## Bileşenin dışarıya verdiği söz

Bir React bileşenini test ederken çoğu zaman önemli olan, içeride hangi state değişkeninin kullanıldığı değil, ekranda ne göründüğü ve kullanıcının ne yapabildiğidir. React Testing Library (RTL), bileşeni DOM’a render eder; sen de bu DOM’u kullanıcıya açık anlamıyla sorgularsın. Bir düğme için rolü ve erişilebilir adı, bir form alanı için rolü ve etiketi ararsın.

Rol, HTML elementinin ve ARIA bilgisinin kullanıcıya ne söylediğini yansıtır. `<button>` doğal olarak button rolündedir; `<input type="search">` searchbox rolünü taşır, sıradan text input ise textbox olur. Düğmenin erişilebilir adı çoğu zaman içindeki görünür metinden, input'un adı ise bağlı label'dan gelir. Testte rol ve ad eşleşmiyorsa önce arayüzün anlamsal HTML'ini kontrol et; sorguyu zorla bir CSS seçicisine çevirmek erişilebilirlik kusurunu saklayabilir.

Bu yaklaşım uygulama ayrıntılarına bağlı testleri azaltır. Bileşenin içindeki state adını değiştirmen, JSX’i bir alt bileşene taşıman ya da CSS sınıfını yeniden adlandırman davranışı değiştirmiyorsa test de bozulmamalıdır. Kullanıcının gördüğü metin veya erişilebilir etkileşim değiştiyse testin bunu fark etmesi gerekir.

0.7’de tanıştığın test anatomisini React arayüzüne uygula:

![Hazırla, çalıştır, doğrula ve hatalı sürümü yakala akışı](diagram:test-anatomisi)

:::model[Test anatomisi]
Önce başlangıç props’larını ve kullanıcıyı hazırla (Arrange), bileşeni render edip etkileşimi gerçekleştir (Act), sonra ekrandaki gözlenebilir sonucu doğrula (Assert). Test adı da tek bir gereksinim cümlesi olsun. Bileşen testi için önemli fark, “sonuç”un çoğu zaman bir dönüş değeri değil, DOM’da görünen ve erişilebilir arayüz olmasıdır.
:::

RTL ile çalışırken şu kuralları uygula:

1. **Bileşeni render etmeden DOM’da arama yapma.** `render(<Component />)` test edilecek arayüzü DOM’a yerleştirir. Dönen `container` üzerinden sınıf veya etiket aramak yerine, sonraki adımda ekrandaki anlamı sorgula.
2. **Önce kullanıcıya açık rolü ve adı ara.** `screen.getByRole('button', { name: 'Ayrıntıları göster' })`, ekran okuyucunun bulacağı düğmeye benzer. Görünen ad, erişilebilir ad ve rol bir arada kontrol edilmiş olur.
3. **Etkileşimi kullanıcıya benzet.** `userEvent.setup()` ile bir kullanıcı kur, ardından `await user.click(...)` gibi etkileşimleri bekle. Tarayıcıdaki tek tıklama birden fazla DOM olayı doğurabildiği için, düşük seviyeli tek bir olayı elle yollamak aynı davranışı her zaman temsil etmez.
4. **Beklentiyi DOM’un sözleşmesine bağla.** Görünür içerik için `toBeInTheDocument`, ARIA durum niteliği için `toHaveAttribute` gibi matcher’lar kullan. Bileşen içindeki değişkeni okumak yerine kullanıcının algıladığı sonucu ölç.
5. **Beklenen yokluğun türünü seç.** Elemanın hiç bulunmaması ile DOM’da bulunup gizlenmesi farklı durumlardır. Hiç render edilmemesi bekleniyorsa `queryByRole` ile sorgula ve `not.toBeInTheDocument()` kullan; görünürlük söz konusuysa elemanın varlığını tek başına yeterli sayma.

## Zaman sırasını izleyelim

Bir gezi kartında ayrıntıların açılıp kapandığını düşün. Başlangıçta düğmenin `aria-expanded` değeri `false`; tıklamadan sonra `true` olmalı ve açıklama DOM’da görünmelidir. Testin her adımında hangi kullanıcı eyleminin hangi görünür sonucu doğurduğunu takip et:

| Sıra | Testte olan | Bileşenin arayüzü | Doğrulama |
| --- | --- | --- | --- |
| 1 | Test başlangıç props’larını hazırlar | Henüz DOM yok | Arrange |
| 2 | `render` çağrılır | “Ayrıntılar” düğmesi kapalı görünür | Arayüz DOM’a geldi |
| 3 | `getByRole` düğmeyi rol ve adıyla bulur | `aria-expanded="false"` | Başlangıç sözleşmesi |
| 4 | `user.click` düğmeye tıklar | State güncellenir, bileşen yeniden render edilir | Act |
| 5 | Test aynı düğmeye ve açıklama bölgesine bakar | `aria-expanded="true"`, açıklama görünür | Assert |

`getByRole` aranan elemanı hemen bulamazsa hata verir. Bu, o anda bulunması gereken bir başlık veya düğme için iyi bir varsayılandır. `queryByRole` ise eşleşme yoksa `null` döndürür; “bu uyarı henüz olmamalı” gibi yokluk beklentilerinde işe yarar. Ağ cevabı gibi sonradan gelecek bir şey beklediğin durumda senkron sorgu yeterli değildir; asenkron sorgular ve ağ taklidi ayrı bir konudur.

Bu sorgu biçimleri hata mesajı üretme biçimiyle de farklılaşır. `getBy...` tam bir eşleşme bekler; sıfır veya birden fazla eşleşme hata sayılır. `queryBy...` yokluğu assertion içinde ifade etmeye yarar ama yine de birden fazla eşleşmede hata verir. `findBy...` DOM'da kısa süre içinde oluşacak tek öğeyi bekleyen Promise döndürür ve `await` edilmelidir. Beklentinin zamanını sorgu tipine göre seçersen test gereksiz beklemez, ama geç beliren arayüzü de erkenden sorgulamaz.

## Kırık test, doğru test

Kırık bir test, DOM’un nasıl kurulduğuna bağlanabilir:

```tsx
const { container } = render(<RouteDetails />)
const details = container.querySelector('.route-details--open')
expect(details).not.toBeNull()
```

Bu test sınıfın adını doğrular; açıklamanın kullanıcıya sunulduğunu ya da düğmenin erişilebilir olduğunu göstermez. Tasarım sınıfı değişince test kırılabilir, açıklama yanlışken de yeşil kalabilir. `data-testid` de benzer biçimde yalnız testin bildiği bir tutamak sağlar; rol ve erişilebilir ad kullanmak mümkünken ilk tercih olmamalıdır.

Şimdi farklı bir örnekte kullanıcı davranışını ölçelim. “Gezi notları” düğmesine basınca bir bölge açılır; açık/kapalı durumu `aria-expanded` ile duyurulur.

```tsx check
import { useState } from 'react'
import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom/vitest'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'

function RouteDetails() {
  const [open, setOpen] = useState(false)

  return (
    <section>
      <h2>Göl yolu</h2>
      <button
        type="button"
        aria-expanded={open}
        aria-controls="route-notes"
        onClick={() => setOpen((value) => !value)}
      >
        Gezi notları
      </button>
      {open && (
        <div id="route-notes" role="region" aria-label="Gezi notları">
          Patika yağmurdan sonra kaygan olabilir.
        </div>
      )}
    </section>
  )
}

describe('RouteDetails', () => {
  it('not düğmesine basınca açıklama bölgesini açar', async () => {
    const user = userEvent.setup()
    render(<RouteDetails />)

    const button = screen.getByRole('button', { name: 'Gezi notları' })
    expect(button).toHaveAttribute('aria-expanded', 'false')

    await user.click(button)

    expect(button).toHaveAttribute('aria-expanded', 'true')
    expect(screen.getByRole('region', { name: 'Gezi notları' })).toBeInTheDocument()
  })
})
```

İz sürerken başlangıçta `open` değeri `false` olduğu için bölge JSX’te üretilmez. Kullanıcı tıklayınca event handler updater çağırır; React yeni state ile render eder, `aria-expanded` değeri `true` olur ve bölge DOM’a eklenir. Test aynı sırayı izlediğinden, hem kontrolün durumunu hem içeriğin varlığını doğrular. Testte beklenen davranışın tamamı budur; state’in adı ya da HTML’in belirli bir iç sarmalayıcıya sahip olması şart değildir.

Bir assertion yazarken tek bir kullanıcı sözleşmesine odaklan. Düğmenin metni değişti mi, `aria-pressed` doğru mu, içerik erişilebilir bir region içinde mi? Bir testte aynı anda on farklı class, internal state ve implementation helper kontrol edersen kalma nedenini ayırt etmek zorlaşır. Kısa, Türkçe bir `it` cümlesi testin gereksinimini okuyan kişiye doğrudan anlatır; arrange, act ve assert blokları da bu cümleyi takip eder.

## Sınır durumları ve sık hatalar

:::mistake[Rol ve ad yerine etikete bağlanmak]
Belirti → Ekrandaki düğme hâlâ çalışırken test `.details-button` sınıfı bulunamadığı için kalır.  
Neden → Test görünür davranış yerine CSS düzenini sözleşme yapmıştır.  
Düzeltme → Düğmeyi `screen.getByRole('button', { name: 'Gezi notları' })` ile bul; sınıfı ancak sınıfın kendisi ürün davranışının parçasıysa sınamak gerekir.
:::

:::mistake[`getByRole` ile henüz olmayan öğeyi aramak]
Belirti → Kapalı durumda açıklama arandığında test hemen hata verir.  
Neden → `getByRole` eşleşme bulamazsa test hatası üretir; yokluğu doğrulamak için uygun sorgu değildir.  
Düzeltme → `expect(screen.queryByRole('region', { name: 'Gezi notları' })).not.toBeInTheDocument()` kullan.
:::

:::mistake[Etkileşimi beklememek]
Belirti → Tıklama testi bazen state güncellemesi tamamlanmadan assertion yapar veya kullanıcı davranışını eksik temsil eder.  
Neden → `user.click` Promise döndürür ve tıklamayı `await` etmeden sonraki satıra geçilmiştir.  
Düzeltme → `const user = userEvent.setup()` oluştur; `await user.click(button)` yaz.
:::

:::mistake[Her elemana `data-testid` eklemek]
Belirti → Testler yeşil, ama düğmenin adı boş ve klavyeyle bulunamıyor.  
Neden → Test kimliği elemanın rolü veya erişilebilir adının yerini tutmaz.  
Düzeltme → Önce rol + ad, form kontrollerinde etiket, sonra metin sorgusunu dene. `getByTestId` ancak kullanıcıya açık bir sorgu uygun olmadığında son çare olsun.
:::

:::sector
Ekipler test adlarını çoğu zaman kabul ölçütü cümlesi gibi yazar: “menü açılınca seçenekleri gösterir.” Böylece ürün, erişilebilirlik ve test kodu aynı davranış etrafında konuşur. `getByRole` kullanımı da yeni bir düğmenin rolünü veya adını eksik bırakmayı erken görünür kılar; test DOM ağacının tesadüfi yapısını sabitlemez.
:::

## Özet

- Bileşeni `render` et; kullanıcıya açık DOM’u `screen` üzerinden sorgula.
- Sorgu önceliğinde rol ve erişilebilir ad ilk tercihtir; `data-testid` son çaredir.
- Etkileşimleri `userEvent.setup()` sonrasında `await` ederek gerçekleştir.
- Görünür içeriği ve ARIA durumunu DOM üzerinden doğrula.
- Bulunması gereken öğe için `getByRole`, bulunmaması gereken öğe için `queryByRole` seç.

**Kendini yokla:** Bir düğmenin ekrandaki adı “Kaydet” ise neden `.save-button` yerine rol ve adla ararsın?  
*Cevap:* Test kullanıcının bulabildiği kontrolü doğrular ve görünüşe ait CSS değişikliklerinden etkilenmez.

**Kendini yokla:** Bir uyarının kapalı durumda hiç render edilmediğini nasıl doğrularsın?  
*Cevap:* `queryByRole` ile sorgular, sonucun `not.toBeInTheDocument()` olduğunu beklersin.
