---
title: "Locator’lar ve web-first assertion’lar"
minutes: 17
kind: concept
---

# Locator’lar ve web-first assertion’lar

Sinema’da bir film kartında “Favorilere ekle” düğmesi var. Düğmeyi testte bulmanın iki yolu olabilir: ekrandaki kullanıcı anlamından yararlanmak ya da HTML class adını ve kart sırasını ezberlemek. İlki arayüzün kullanıcıya verdiği ada dayanır; ikincisi görünüş değiştiğinde kolayca bozulur.

Bir testin sayfadaki öğeyi tarif etmesine **locator** denir. Playwright’ta locator’ı çoğunlukla role ve erişilebilir ada göre kurarsın. **Role**, öğenin kullanıcı arayüzündeki işidir (`button`, `heading`, `link` gibi); **erişilebilir ad** ise ekran okuyucu gibi yardımcı teknolojilerin o öğeyi tanıttığı metindir.

## Önce kullanıcıya görünen adı kullan

Diyelim ki film kartında “Favorilere ekle” yazan bir düğme var:

```ts
const favorite = page.getByRole('button', { name: 'Favorilere ekle' })
await favorite.click()
```

Locator tanımını yazdığın anda Playwright sayfaya gidip öğeyi seçmez. Bu, ne aradığını anlatan bir tarif. `click()` çalıştığında Playwright tarifi sayfaya uygular ve tıklanabilir düğmeyi bulur.

Bu ayrım locator’ı değişkende tutmayı güvenli kılar. React kartı güncelleyip DOM öğesini yeniden çizse de locator eski HTML öğesine bağlı kalmaz; eylem sırasında güncel sayfada yeniden arar. Kullanıcı için “Favorilere ekle” düğmesi aynı kaldığı sürece CSS class’ı değişse bile testin anlamı korunur.

Bir de adın parça eşleşmesine dikkat et. Varsayılan arama “Matrix” metnini “Matrix Reloaded” başlığında da eşleştirebilir. Tam başlığı istiyorsan `exact: true` kullan:

```ts
const exactTitle = page.getByRole('heading', {
  name: 'Matrix',
  exact: true,
})
```

Burada küçük seçenek testin hangi öğeyi kastettiğini açık hale getiriyor. Birden çok karta uyan belirsiz bir locator’la eylem yapmaya çalışırsan Playwright **strict mode** hatası verir: tek bir düğme seçemediğini söyler. Bu koruma yararlıdır; yanlış kartı sessizce tıklayıp testi yeşil bırakmaz.

## Kartın içindeki düğmeye ulaş

Film listesinde aynı adlı favori düğmesi her kartta bulunabilir. Sadece “Favorilere ekle” adını ararsan birden çok eşleşme gelir. Önce doğru filmi içeren kartı bulup sonra o kartın içindeki düğmeye bak:

```ts check
import type { Page } from '@playwright/test'

export function watchlistLinks(page: Page) {
  const list = page.getByRole('list', { name: 'İzleme listelerim' })
  return list.getByRole('link')
}
```

Önce “İzleme listelerim” adlı listeyi bulup sonra yalnızca onun içindeki bağlantıları arıyoruz. `getByRole` zinciri kapsamı daraltır; böylece sayfanın başka bölümündeki aynı adlı bir bağlantı karışmaz. Film kartında da aynı fikirle önce doğru kartı seçip sonra içindeki eyleme geçebilirsin.

Sayfada başlıklar ayrı bir liste içindeyse aramayı o **region** ile sınırlandırabilirsin. Region, sayfanın “Filmler” gibi adı olan ve içerik bakımından anlamlı bir bölümüdür. Önce “Filmler” listesini bulup sonra içindeki başlıkları aramak, aynı ad başka bölümde bulunsa bile kapsamı belirginleştirir.

Örneğin sonuç bölümünün erişilebilir adı “Arama sonuçları” ise `page.getByRole('region', { name: 'Arama sonuçları' })` ile o bölümü bulursun; ardından onun içindeki `listitem` öğelerini sayabilirsin. Locator’ı kapsayıcıdan başlatmak, sayfadaki başka listelerin sonuç sayısına karışmasını önler.

Başlıklar HTML’de farklı seviyelerdeyse `level` ile de daraltırsın; örneğin `level: 3`, `<h3>` başlığını seçer. `filter({ has: locator })` ise bir öğeyi, içinde başka bir locator bulunduğu için seçer:

```ts
const parisTexasCard = page.getByRole('listitem').filter({
  has: page.getByRole('heading', { name: 'Paris, Teksas', exact: true }),
})
const parisTexasFavorite = parisTexasCard.getByRole('button', {
  name: 'Favorilere ekle',
})
```

Bu parça, başlığın yer aldığı kartı bulup eylemi o kartın içine sınırlar. Gerçek sayfandaki başlıklar `<h3>` ise başlık locator’ına `{ level: 3 }` eklersin; böylece sayfanın başka yerindeki aynı metin kartı yanlış seçtirmez.

CSS seçicisi veya test id’si bazen gerekir; ama kullanıcıya görünen rol ve ad genellikle daha dayanıklıdır. `nth(4)` gibi sıra numarası kullandığında beşinci kartın hep aynı film olacağı varsayılır. Yeni bir kart eklenince test başka filmi seçebilir.

## Sonuçların gelmesini beklemek

Arama alanına “başlangıç” yazınca sonuçlar anında gelmeyebilir. Uygulama bir süre bekleyip isteği gönderir, sonra cevapla listeyi yeniler. Bu sırada bir kez görünürlük okuyan assertion eski durumu görüp hemen başarısız olabilir.

Testte beklediğin koşulu kontrol eden ifadeye assertion denmişti. **Web-first assertion** Playwright’ın beklenen sayfa koşulunu tekrar tekrar kontrol etmesidir. Böylece test sabit bir süre uyumak yerine sonuç görünene kadar bekler:

```ts
await page.getByRole('searchbox', { name: 'Film ara' }).fill('başlangıç')
await expect(
  page.getByRole('link', { name: 'Başlangıç', exact: true }),
).toBeVisible()
```

`expect` için `await` kullanmamız önemli: assertion’ın koşulu oluşana kadar bekler. Tek seferlik kontrol ise o anki sonucu alır ve devam eder:

```ts
// Tek sefer bakar; sonuç henüz gelmediyse hemen false olur.
expect(
  await page.getByRole('link', { name: 'Başlangıç' }).isVisible(),
).toBe(true)
```

### İstekten sonuca kadar iz sürelim

| An | Sayfada ne var? | Tek seferlik `isVisible()` | Web-first `toBeVisible()` |
| --- | --- | --- | --- |
| Arama yazılır | Eski sonuçlar hâlâ ekranda olabilir | Eski durumu okur | Beklemeye başlar |
| İstek gönderilir | Yeni sonuç henüz yok | `false` dönebilir ve test biter | Koşulu yeniden kontrol eder |
| Cevap gelir | Yeni sonuçlar çizilir | Test daha önce kalmış olabilir | Bağlantı görünür, test sürer |

Tabloda testin önemli farkı bekleme miktarı değil, neyi beklediğidir. Sabit `waitForTimeout(1000)` bir saniyeyi her zaman harcar; yoğun CI makinesinde de cevap daha geç gelse hata verir. Web-first assertion cevap hızlıysa hemen geçer, yavaşsa izin verilen süre boyunca koşulu dener.

![Locator tarifi, kullanıcı eylemi ve yeniden denenen görünür koşul](diagrams/locator-dongusu.svg "Playwright locator’ı eylem ve assertion sırasında güncel DOM’da çözer.")

Örneğin aramadan sonra yalnızca bağlantıyı değil, URL’deki `q` değerini de doğrulayabilirsin. URL adres çubuğunda görünen adrestir; arama ifadesinin URL’de tutulması yenileme ve paylaşımda aynı aramayı açmayı sağlar. Bir sonuç listesinin kaç satır olduğunu `toHaveCount(n)` ile, yüklenme mesajının kalktığını `toBeHidden()` ile beklersin:

```ts check
import { expect, test } from '@playwright/test'

test('arama bağlantısı ve URL aynı filmi gösterir', async ({ page }) => {
  await page.goto('/search')
  await page.getByRole('searchbox', { name: 'Film ara' }).fill('başlangıç')
  await expect(page).toHaveURL((url) => url.searchParams.get('q') === 'başlangıç')
  await expect(
    page.getByRole('link', { name: 'Başlangıç', exact: true }),
  ).toBeVisible()
  await expect(page.getByRole('listitem')).toHaveCount(1)
  await expect(page.getByText('Aranıyor…')).toBeHidden()
})
```

Önce URL güncellenir, sonra istenen film bağlantısı görünür, sonuç listesinde tek satır kalır ve yüklenme mesajı kaybolur. Her assertion ayrı bir gözlemdir: doğru URL tek başına doğru sonuçların çizildiğini, doğru film bağlantısı da eski sonuçların silindiğini kanıtlamaz.

## Hata görünür olduğunda düzelt

:::mistake[Arada bir geçen görünürlük testi]
**Belirti:** Yerelde arama testi çoğu kez geçer, CI’da bazen kalır. → **Neden:** `isVisible()` yalnızca bir kez okur ve yanıt gelmeden `false` dönebilir. → **Düzeltme:** `await expect(locator).toBeVisible()` ile görünür olmasını bekle.
:::

:::mistake[Birden çok karta tıklama]
**Belirti:** `strict mode violation` birden çok düğme eşleştiğini söylüyor. → **Neden:** Locator tüm kartlardaki aynı adlı düğmeyi arıyor. → **Düzeltme:** Önce başlığı tam eşleşen kartı bul, sonra düğmeyi kartın içinden seç.
:::

:::mistake[Beşinci kartı seçmek]
**Belirti:** Film eklenince test favoriyi yanlış karta basıyor. → **Neden:** `nth(4)` görünür film adını değil sayfa sırasını tanımlıyor. → **Düzeltme:** Kartı tam başlık veya adı olan region ile tarif et.
:::

Eylemler de çoğu zaman kendi beklemesini yapar. Örneğin `click()` öğe görünür ve etkin olana kadar, `fill()` alan düzenlenebilir olana kadar dener. Bu özellik sabit uykulara ihtiyacı azaltır; fakat eylemden sonraki sonucu sen yine assertion’la doğrulamalısın.

:::info[Derinlemesine (isteğe bağlı)]
Playwright eylem öncesinde görünürlük, etkinlik ve öğenin üstünün kapanmaması gibi koşullara bakar; bunlara actionability koşulları denir. Bir sayfanın erişilebilirlik ağacını tek şablonda karşılaştıran `toMatchAriaSnapshot` da vardır. Başlangıçta tek tek `getByRole` assertion’ları daha açık olur; snapshot gerektiğinde ayrıca öğrenebilirsin.
:::

## Özet

- Locator, sayfadaki öğeyi kullanıcıya görünen role ve adla tarif eder; eylem sırasında yeniden çözülür.
- Tek bir karta ulaşmak için önce kartı tam başlıkla daralt, sonra içindeki düğmeyi seç.
- Web-first assertion beklenen görünür koşulu tekrar dener; tek seferlik okuma veya sabit uyku yarış durumunu çözmez.
- URL ve ekrandaki sonucu ayrı ayrı kontrol ederek aramanın tamamlandığını kanıtla.

**Yeni terimler**

- **Locator:** Sayfada aranacak öğeyi tarif eden Playwright nesnesi.
- **Role:** Bir öğenin düğme, başlık veya bağlantı gibi kullanıcı arayüzü görevi.
- **Erişilebilir ad:** Yardımcı teknolojilerin öğeyi tanımak için kullandığı ad.
- **Web-first assertion:** Sayfa koşulunu oluşana kadar yeniden kontrol eden Playwright assertion’ı.
- **Region:** Sayfanın adı olan, içerikçe anlamlı bölümü.

**Kendini yokla:** React yeniden çizim yaptığında locator neden eski düğüme takılı kalmaz?  
*Cevap:* Locator eski DOM öğesini saklamaz; eylem sırasında tarifini güncel sayfada yeniden çözer.

**Kendini yokla:** Arama sonucunu neden `isVisible()` yerine `toBeVisible()` ile bekleriz?  
*Cevap:* `isVisible()` bir anı okur; web-first assertion sonuç gelene kadar tekrar dener.
