---
title: "Locator’lar ve web-first assertion’lar"
minutes: 14
kind: concept
---

# Locator’lar ve web-first assertion’lar

:::pain[Problem]
İlk E2E testlerinde seçicileri DevTools’tan kopyaladın:

```ts
await page.locator('li.workshop-card:nth-child(5) .btn-join').click()
```

Atölye kartlarını yeni bir UI kitine taşıdın; class’ların hepsi değişti. Uygulama kusursuz çalışıyor ama E2E testleri kırmızı. Bir de şu test var: bazen geçiyor, bazen kalıyor.

```ts
await page.getByLabel('Atölye ara').fill('suluboya')
expect(await page.getByRole('link', { name: 'Suluboya temelleri' }).isVisible()).toBe(true)
```
:::

İki ayrı hastalık: test **nasıl bulduğuna** bağlı (class’lar, sıra), ve **ne zaman baktığına** bağlı (girdi değiştikten sonra sonuçların yenilenmesi ve ağ yanıtı). İkisinin de ilacı Playwright’ta hazır.

## Locator: tarif, eylem ve beklenen sonuç

:::model[Locator’dan assertion’a]
Locator oluşturmak DOM sorgusunu o anda çalıştırmaz; hangi öğeyi aradığını tarif eder. Eylem ve web-first assertion bu tarifi tekrar çözer, uygun koşul oluşana kadar dener. Böylece yeniden render eski DOM düğümünü kullanmana neden olmaz.

![Locator tarifi, kullanıcı eylemi ve yeniden denenen görünür koşul](diagrams/locator-dongusu.svg)
:::

Kurallar:

1. Locator, eylem veya assertion başlayana kadar DOM öğesi seçmez.
2. Eylem tek bir eşleşme gerektirir; birden fazla eşleşme strict mode hatasıdır.
3. Rol ve erişilebilir ad kullanıcıya görünen sözleşmeyi seçer; class ve DOM sırası sunum ayrıntısıdır.
4. Web-first assertion koşulu zaman aşımına kadar tekrar değerlendirir; tek seferlik isVisible sonucu beklemez.
5. Locator belirsizse `.first()` eklemek yerine kapsamı kullanıcı anlamıyla daralt.

## Locator: “nasıl bulunur” tarifi

```ts
const booking = page.getByRole('button', { name: 'Programa ekle' })
```

Bu satır sayfada **hiçbir şey aramaz**. Bir tarif oluşturur; tarif, bir eylem (`click`, `fill`) ya da assertion çalıştığı **anda** uygulanır, her denemede yeniden. React listeyi yeniden render etse bile locator bayatlamaz.

Öncelik sırası Modül 11’deki RTL sırasıyla aynı, çünkü mantık aynı: kullanıcı sayfayı nasıl algılıyorsa öyle bul.

| Öncelik | Playwright | RTL karşılığı |
| --- | --- | --- |
| 1 | `page.getByRole('button', { name: 'Kaydet' })` | `screen.getByRole(…)` |
| 2 | `page.getByLabel('Parola')` | `screen.getByLabelText(…)` |
| 3 | `page.getByPlaceholder(…)`, `page.getByText(…)` | `getByPlaceholderText`, `getByText` |
| 4 | `page.getByTestId('rating')` | `getByTestId` |
| Son çare | `page.locator('css=…')` | `container.querySelector` |

Rol ve erişilebilir ad **tasarım değişikliğinden etkilenmez**: class’lar değişse de eylem hâlâ “Programa ekle” adlı bir düğmedir.

## Adı eşleştirmek: `exact`

`name` varsayılan olarak **büyük/küçük harf duyarsız ve parça** eşleşir:

```ts
page.getByRole('heading', { name: 'Seramik' })              // “Seramik” ve “Seramik başlangıç”
page.getByRole('heading', { name: 'Seramik', exact: true }) // yalnızca “Seramik”
```

## Strict mode: birden fazla eşleşme hatadır

Bir eylem, birden çok öğeye uyan locator ile çalıştırılırsa Playwright tahmin etmez, durur:

```
locator.click: Error: strict mode violation: getByRole('button', { name: 'Programa ekle' }) resolved to 7 elements:
    1) <button type="button" class="btn btn-book">Programa ekle</button> aka …
    2) …
```

Bu bir özellik: “hangi karta tıkladım?” sorusu belirsizse test yanlış karta tıklayıp yeşil kalmaz. `.first()` / `.nth(4)` hatayı susturur ama yine sıraya bağımlı kalır; son çaredir.

Exact seçimi ürün metni benzersiz değilse de kullanışlıdır. “Seramik” adında hem bir ana kategori hem de “Seramik başlangıç” dersi varsa parça eşleşmesi iki sonuç verir. Erişilebilir ad kullanıcı için doğru olsa bile locator’ın hangi öğeyi kastettiği açık olmalıdır. Gerekirse önce sayfa içindeki anlamlı region’ı seç, sonra orada tam adı ara.

Locator’ın tekrar çözülmesi, DOM’u test içinde elle saklamaktan daha güvenlidir. React yeni sonuçları render ettiğinde önceki HTML düğümü kaldırılmış olabilir. Bir locator eylem anında yeniden arandığından güncel düğüme gider; `ElementHandle` gibi tek bir eski node’a bağlanmaz. Bu davranış otomatik bekleme ile birlikte locator’ları E2E’nin temel API’si yapar.

## Zincirleme ve filtre

Önce kartı, sonra kartın **içindeki** butonu bul (RTL’deki `within(card)` gibi):

```ts check
import type { Page } from '@playwright/test'

export async function bookEvent(page: Page, title: string) {
  const card = page.getByRole('listitem').filter({
    has: page.getByRole('heading', { name: title, exact: true }),
  })
  await card.getByRole('button', { name: 'Programa ekle' }).click()
}
```

| Filtre | Anlamı |
| --- | --- |
| `filter({ hasText: 'Seramik' })` | İçinde bu metin geçen (parça eşleşme!) |
| `filter({ has: locator })` | İçinde bu locator’a uyan bir öğe olan |
| `filter({ hasNot: locator })` | İçinde olmayan |
| `.visible()` | Yalnızca görünür eşleşmeler (yeni sürümlerde; eski `:visible` seçicisinin yerine) |

Butonun adı kayıttan sonra “Programa ekle” yerine “Programda” oluyorsa, testte eylemden önceki adı ve eylemden sonraki durumu ayrı ayrı doğrula.

## Eylemler kendiliğinden bekler

`click()` tıklamadan önce öğenin DOM’da olmasını, görünür, hareketsiz (animasyon bitmiş), etkin ve üstünün kapalı olmamasını bekler (actionability). `fill()` alanın düzenlenebilir olmasını bekler. Bu yüzden E2E testinde `waitForTimeout(1000)` yazmak neredeyse hiç gerekmez; yazdığında test hem yavaşlar hem de yavaş bir makinede yine kalır.

## Bir aramanın zamanını izleyelim

Arama alanına “seramik” yazıldığını düşün. Kullanıcı yazmayı bitirdikten sonra debounce tamamlanır, sonuç isteği gider, cevap gelir ve liste güncellenir. Testin tek bir anlık görüntü alması bu zincirin ortasına denk gelebilir.

| Zaman | Sayfa | Tek seferlik kontrol | Web-first kontrol |
| --- | --- | --- | --- |
| Yazma biter | Eski sonuçlar görünür | Eski sonuçla true döner | Beklemeye devam eder |
| Bekleme süresi biter | Yeni sorgu gönderilir | Henüz false olabilir | Beklemeye devam eder |
| Yanıt gelir | Yeni sonuçlar render edilir | Kontrol çoktan bitmiştir | Koşul sağlanır ve biter |

Kırık örnek yalnızca mevcut duruma bakar ve kullanıcı cevabını beklemez:

~~~ts
expect(await page.getByRole('link', { name: 'Seramik atölyesi' }).isVisible()).toBe(true)
~~~

Düzeltilmiş örnek beklenen UI koşulunu otomatik yeniden dener:

~~~ts check
import { expect, test } from '@playwright/test'

test('arama sonucu hazır olduğunda bağlantı görünür', async ({ page }) => {
  await page.goto('/program')
  await page.getByRole('searchbox', { name: 'Etkinlik ara' }).fill('seramik')
  await expect(page.getByRole('link', { name: 'Seramik atölyesi' })).toBeVisible()
})
~~~

## Web-first assertion’lar

```ts
// ✗ Bir kez bakar, o anki cevabı döndürür: debounce bitmediyse false
expect(await page.getByRole('link', { name: 'Başlangıç' }).isVisible()).toBe(true)

// ✓ Koşul sağlanana kadar (varsayılan 5 sn) tekrar tekrar bakar
await expect(page.getByRole('link', { name: 'Seramik atölyesi' })).toBeVisible()
```

`await expect(locator)…` biçimindeki her assertion “web-first”tür: sayfa yetişene kadar dener. RTL’deki `findBy…` ile `waitFor`’un birleşimi gibi düşün.

| Assertion | Ne zaman? |
| --- | --- |
| `toBeVisible()` / `toBeHidden()` | Görünüyor mu? (“Aranıyor…” kalktı mı?) |
| `toHaveText()` / `toContainText()` | Metin tam / içeriyor |
| `toHaveCount(n)` | Kaç eşleşme var? (eski sonuçlar kaldı mı?) |
| `toHaveValue()`, `toBeEnabled()`, `toHaveAttribute()` | Form alanları, butonlar |
| `expect(page).toHaveURL(…)` | Adres (string, RegExp ya da `url => boolean`) |

URL de state’tir (Modül 6): arama metninin `?q=`’ya yazıldığını fonksiyon biçimiyle doğrulayabilirsin; Türkçe karakterlerin kodlanmasıyla uğraşmazsın:

```ts
await expect(page).toHaveURL((url) => url.searchParams.get('q') === 'seramik')
```

## Yapıyı tek seferde doğrulamak: aria snapshot

Bir bölgenin erişilebilirlik ağacını YAML benzeri bir şablonla karşılaştırabilirsin:

```ts
await expect(page.getByRole('navigation', { name: 'Ana menü' })).toMatchAriaSnapshot(`
  - navigation "Ana menü":
    - link "Ana sayfa"
    - link "Program"
    - link "Biletlerim"
`)
```

Şablon **kısmi** eşleşir: yazmadığın öğeler (aradaki ayraç metinleri, `href`’ler) sorun değildir; yazdıklarının sırası ise önemlidir. Menü ve kart gibi “iskelet” kontrolleri için tek tek `getByRole` yazmaktan daha okunur.

:::mistake[Sık hata]
**Belirti:** Görünür öğe testi arada bir geçer, arada bir kalır. → **Neden:** Assertion sonucu bir kez okunmuştur; UI henüz güncellenmemiştir. → **Düzeltme:** Web-first assertion’ı await ile kullan.
:::

:::mistake[Assertion’ı await etmemek]
**Belirti:** Test koşul oluşmadan biter veya hata başka adımda görünür. → **Neden:** Web-first assertion promise’i beklenmemiştir. → **Düzeltme:** `await expect(locator)…` biçimini kullan.
:::

:::mistake[Sayısal sıraya bağlanmak]
**Belirti:** Tasarım sistemi değişince beşinci kart seçimi başka öğeye gider. → **Neden:** nth(4) görünür ad yerine DOM sırasını sözleşme saymıştır. → **Düzeltme:** Kartı benzersiz başlık veya anlamlı bir kapsayıcıyla daralt.
:::

## Özet

- Locator, DOM öğesini hemen değil eylem veya assertion sırasında çözer.
- Rol ve erişilebilir ad tasarım ayrıntısından daha kararlı bir sözleşmedir.
- Strict mode belirsiz eşleşmeyi gizlemez; locator’ı bağlamla daralt.
- Web-first assertion beklenen UI koşulunu tekrar dener; sabit uyku ekleme.

**Kendini yokla:** Neden bir locator’ı değişkende saklamak yeniden render sonrası güvenlidir?  
*Cevap:* Locator DOM düğümünü değil, yeniden çözülebilen arama tarifini tutar.

**Kendini yokla:** İlk kartı görünür bulmak yeni aramanın sonucunu neden kanıtlamaz?  
*Cevap:* Önceki aramanın kartı hâlâ DOM’da olabilir; yeni sorguya ait görünür durumu bekle.

:::sector[Sektörde]
`npx playwright codegen http://localhost:5174` tarayıcıyı açar; tıkladıkça rol tabanlı locator’larla test kodu üretir. Üretilen kodu başlangıç noktası olarak kullan, ama assertion’ları kendin düşün: codegen neyi **doğrulaman** gerektiğini bilemez.
:::
