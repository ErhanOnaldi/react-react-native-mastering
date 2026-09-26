---
title: "Locator’lar ve web-first assertion’lar"
minutes: 10
kind: concept
---

# Locator’lar ve web-first assertion’lar

:::pain[Problem]
İlk E2E testlerinde seçicileri DevTools’tan kopyaladın:

```ts
await page.locator('li.movie-card:nth-child(5) .btn-fav').click()
```

Modül 20’de UI kitini shadcn/ui ile değiştirdin; class’ların hepsi değişti (`data-slot="button"`, `inline-flex …`). Uygulama kusursuz çalışıyor ama **dokuz** E2E testi kırmızı. Bir de şu test var: bazen geçiyor, bazen kalıyor.

```ts
await page.getByLabel('Film ara').fill('başlangıç')
expect(await page.getByRole('link', { name: 'Başlangıç' }).isVisible()).toBe(true)
```
:::

İki ayrı hastalık: test **nasıl bulduğuna** bağlı (class’lar, sıra), ve **ne zaman baktığına** bağlı (aramanın 350 ms debounce’u ve ağ gecikmesi). İkisinin de ilacı Playwright’ta hazır.

## Locator: “nasıl bulunur” tarifi

```ts
const favorite = page.getByRole('button', { name: 'Favorilere ekle' })
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

Rol ve erişilebilir ad **tasarım değişikliğinden etkilenmez**: shadcn’e geçince class’lar değişti ama buton hâlâ “Favorilere ekle” adlı bir buton.

## Adı eşleştirmek: `exact`

`name` varsayılan olarak **büyük/küçük harf duyarsız ve parça** eşleşir:

```ts
page.getByRole('heading', { name: 'Matrix' })              // "Matrix" ve "Matrix Reloaded"
page.getByRole('heading', { name: 'Matrix', exact: true }) // yalnızca "Matrix"
```

## Strict mode: birden fazla eşleşme hatadır

Bir eylem, birden çok öğeye uyan locator ile çalıştırılırsa Playwright tahmin etmez, durur:

```
locator.click: Error: strict mode violation: getByRole('button', { name: 'Favorilere ekle' }) resolved to 7 elements:
    1) <button type="button" aria-pressed="false" class="btn btn-fav">Favorilere ekle</button> aka …
    2) …
```

Bu bir özellik: “hangi karta tıkladım?” sorusu belirsizse test yanlış karta tıklayıp yeşil kalmaz. `.first()` / `.nth(4)` hatayı susturur ama yine sıraya bağımlı kalır; son çaredir.

## Zincirleme ve filtre

Önce kartı, sonra kartın **içindeki** butonu bul (RTL’deki `within(card)` gibi):

```ts check
import type { Page } from '@playwright/test'

export async function toggleFavorite(page: Page, title: string) {
  const card = page.getByRole('listitem').filter({
    has: page.getByRole('heading', { name: title, exact: true }),
  })
  await card.getByRole('button', { name: /Favori/ }).click()
}
```

| Filtre | Anlamı |
| --- | --- |
| `filter({ hasText: 'Matrix' })` | İçinde bu metin geçen (parça eşleşme!) |
| `filter({ has: locator })` | İçinde bu locator’a uyan bir öğe olan |
| `filter({ hasNot: locator })` | İçinde olmayan |
| `.visible()` | Yalnızca görünür eşleşmeler (yeni sürümlerde; eski `:visible` seçicisinin yerine) |

Butonun adı tıklamayla “Favorilere ekle” ↔ “Favorilerden çıkar” diye değişiyorsa, ad için düzenli ifade (`/Favori/`) iki durumu da tutar.

## Eylemler kendiliğinden bekler

`click()` tıklamadan önce öğenin DOM’da olmasını, görünür, hareketsiz (animasyon bitmiş), etkin ve üstünün kapalı olmamasını bekler (actionability). `fill()` alanın düzenlenebilir olmasını bekler. Bu yüzden E2E testinde `waitForTimeout(1000)` yazmak neredeyse hiç gerekmez; yazdığında test hem yavaşlar hem de yavaş bir makinede yine kalır.

## Web-first assertion’lar

```ts
// ✗ Bir kez bakar, o anki cevabı döndürür: debounce bitmediyse false
expect(await page.getByRole('link', { name: 'Başlangıç' }).isVisible()).toBe(true)

// ✓ Koşul sağlanana kadar (varsayılan 5 sn) tekrar tekrar bakar
await expect(page.getByRole('link', { name: 'Başlangıç' })).toBeVisible()
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
await expect(page).toHaveURL((url) => url.searchParams.get('q') === 'başlangıç')
```

## Yapıyı tek seferde doğrulamak: aria snapshot

Bir bölgenin erişilebilirlik ağacını YAML benzeri bir şablonla karşılaştırabilirsin:

```ts
await expect(page.getByRole('navigation', { name: 'Ana menü' })).toMatchAriaSnapshot(`
  - navigation "Ana menü":
    - link "Ana sayfa"
    - link "Ara"
    - link "İzleme listelerim"
`)
```

Şablon **kısmi** eşleşir: yazmadığın öğeler (aradaki ayraç metinleri, `href`’ler) sorun değildir; yazdıklarının sırası ise önemlidir. Menü ve kart gibi “iskelet” kontrolleri için tek tek `getByRole` yazmaktan daha okunur.

:::mistake[Sık hata]
Assertion’ı `await`’siz yazmak: `expect(locator).toBeVisible()`. Dönen promise beklenmez; test koşul sağlanmadan biter, hata ya hiç görünmez ya da başka bir testin ortasında patlar. Web-first assertion’ların **hepsi** `await` ister.
:::

:::sector[Sektörde]
`npx playwright codegen http://localhost:5174` tarayıcıyı açar; tıkladıkça rol tabanlı locator’larla test kodu üretir. Üretilen kodu başlangıç noktası olarak kullan, ama assertion’ları kendin düşün: codegen neyi **doğrulaman** gerektiğini bilemez.
:::
