---
title: "Page object ve fixture’lar"
minutes: 10
kind: concept
---

# Page object ve fixture’lar

:::pain[Problem]
E2E paketin büyüdü: altı spec dosyası. Dördü girişle başlıyor, üçü arama yapıyor. Her birinde aynı satırlar:

```ts
await page.goto('/login')
await page.getByLabel('Kullanıcı adı').fill('emilys')
await page.getByLabel('Parola').fill('emilyspass')
await page.getByRole('button', { name: 'Giriş yap' }).click()
```

shadcn formuna geçince etiket “Kullanıcı adı veya e-posta” oldu: dört dosyayı tek tek düzelttin. Arama adımlarını da her dosya biraz farklı bekliyor; ikisi ara sıra kalıyor.
:::

Tekrarlanan kod, Modül 9’da uygulama kodunda gördüğümüz acının aynısı. İlacı da aynı: **sorumluluğu tek yerde topla**. Playwright’ta bunun iki aracı var: page object ve fixture.

## Page object: sayfanın test API’si

Bir sayfanın locator’larını ve kullanıcı eylemlerini bir sınıfta toplarsın. Testler sayfanın HTML’ini değil, bu sınıfın metotlarını bilir.

```ts check title="e2e/pages/login-page.ts"
import type { Locator, Page } from '@playwright/test'

export class LoginPage {
  readonly page: Page
  readonly username: Locator
  readonly password: Locator
  readonly submit: Locator

  constructor(page: Page) {
    this.page = page
    this.username = page.getByLabel('Kullanıcı adı')
    this.password = page.getByLabel('Parola')
    this.submit = page.getByRole('button', { name: 'Giriş yap' })
  }

  async goto() {
    await this.page.goto('/login')
  }

  async login(username: string, password: string) {
    await this.username.fill(username)
    await this.password.fill(password)
    await this.submit.click()
  }
}
```

Etiket değişince **tek satır** değişir. Test ise hikâyeyi anlatır:

```ts
const loginPage = new LoginPage(page)
await loginPage.goto()
await loginPage.login('emilys', 'emilyspass')
await expect(page).toHaveURL('/profile')
```

:::mistake[Sık hata]
`constructor(readonly page: Page) {}` kısayolu (parameter property) TypeScript’e özgü, **silinemeyen** bir sözdizimidir. Bu platformda ve Sinema’nın tsconfig’lerinde `erasableSyntaxOnly` açık; bu yazım tip hatası verir. Alanları yukarıdaki gibi açıkça tanımla.
:::

### Assertion nerede durmalı?

- **Eylemler ve locator’lar** page object’te.
- **Doğrulamalar** çoğunlukla testte: “bu senaryoda ne bekliyoruz?” testin konusudur.
- İstisna: **senkronizasyon**. `search()` metodu “sonuçlar gelene kadar” beklemeli ki onu çağıran her test aynı, doğru beklemeyi miras alsın. Beklemeyi her testte ayrı ayrı yazmak, dersin başındaki “ikisi ara sıra kalıyor” sorununun kaynağıdır.

Doğru beklemeyi seçmek önemli: yeni bir arama yazıldığında **eski** sonuçlar hâlâ ekrandadır. “İlk sonuç görünsün” diye beklersen eski sonuçla dönersin. “Bu sorgunun sonucu görünsün” diye bekle (örneğin “matrix” için sonuç başlığı).

## Fixture: testin ihtiyacını hazırla

Her testin başında `new LoginPage(page)` yazmak da bir tekrar. Fixture, testin parametre olarak **istediği** şeyi hazırlar; `page` de aslında Playwright’ın hazır bir fixture’ıdır.

```ts check title="e2e/fixtures.ts"
import { test as base, type Page } from '@playwright/test'

class SearchPage {
  readonly page: Page
  constructor(page: Page) {
    this.page = page
  }
  async goto() {
    await this.page.goto('/search')
  }
}

export const test = base.extend<{ searchPage: SearchPage }>({
  searchPage: async ({ page }, use) => {
    const searchPage = new SearchPage(page) // kurulum
    await searchPage.goto()
    await use(searchPage) // test burada çalışır
    // use'dan sonrası: temizlik (test kalsa bile çalışır)
  },
})
export { expect } from '@playwright/test'
```

```ts
import { expect, test } from './fixtures'

test('arama sonuç gösterir', async ({ searchPage }) => {
  // searchPage hazır ve /search açık
})
```

- Fixture **tembeldir**: yalnızca onu isteyen testlerde kurulur.
- `use(…)`’dan önceki kod kurulum, sonraki kod temizliktir. Test kalsa bile temizlik çalışır (`try/finally` yazmana gerek yok).
- Varsayılan kapsam **test**: her teste yenisi. Pahalı ve paylaşılabilir şeyler için `{ scope: 'worker' }` ile işçi (worker) başına bir kez kurulabilir.
- Hazır fixture’lar: `page`, `context`, `browser`, `request` (tarayıcısız HTTP), `baseURL`.

:::warning[ESLint ve `use`]
Sinema’nın ESLint ayarı `react-hooks` kurallarını tüm `.ts` dosyalarına uyguluyor. Kural, fixture’daki `use(searchPage)` çağrısını React’in `use()` hook’u sanır ve hata verir: *React Hook "use" is called in function "searchPage" that is neither a React function component nor a custom React Hook function.* Çözüm: `eslint.config.js`’te React kurallarını `files: ['src/**/*.{ts,tsx}']` ile uygulama koduna sınırla. (İkinci parametreye başka bir ad vermek de çalışır ama Playwright belgeleriyle ayrışır.)
:::

## Adımları okunur kılmak: `test.step`

Uzun bir senaryoyu adımlara bölersen HTML raporunda ve trace’te (7. ders) başlık başlık görünür:

```ts
await test.step('Giriş yap', async () => {
  await loginPage.login('emilys', 'emilyspass')
})
```

:::sector[Sektörde]
Page object en yaygın E2E düzeni; fixture ise Playwright’ın ona eklediği “bağımlılık enjeksiyonu”. Büyük paketlerde `test.extend` ile `loginPage`, `searchPage`, hatta giriş yapmış bir `authedPage` fixture’ı görürsün. Aşırıya kaçma: her tıklamayı bir metoda sarmak testleri okunmaz kılar. Metotlar **kullanıcının niyetini** anlatmalı: `login`, `search`, `openMovie`.
:::
