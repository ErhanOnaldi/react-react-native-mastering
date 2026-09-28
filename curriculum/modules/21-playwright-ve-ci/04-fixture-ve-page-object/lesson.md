---
title: "Page object ve fixture’lar"
minutes: 14
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

## Hazırlık, sayfa eylemi ve senaryo ayrı işler

:::model[Test sorumlulukları]
Fixture testin ihtiyaç duyduğu başlangıç koşulunu kurar ve gerekiyorsa temizler. Page object bir sayfada kullanıcının yapabildiği anlamlı eylemleri ve locator’ları toplar. Test ise hangi iş akışının gerçekleştiğini ve hangi sonucu beklediğini anlatır.

![Fixture, page object ve testin sorumlulukları](diagrams/test-sorumluluklari.svg)
:::

Kesin kurallar:

1. Fixture setup kodu use çağrısından önce, teardown kodu sonra çalışır.
2. Fixture yalnızca testi isteyen durumda kurulur; her test varsayılan olarak kendi page’ini alır.
3. Page object kullanıcı niyetini adlandırır; her click için ayrı metot üretmez.
4. Test iş akışını ve beklenen sonucu sahiplenir; locator ayrıntısını çoğunlukla page object taşır.
5. Bir eylem metodu çağıran kod için anlamlı olduğunda gereken UI durumunu bekler; genel assertion’lar testte kalır.

## Page object: sayfanın test API’si

Bir sayfanın locator’larını ve kullanıcı eylemlerini bir sınıfta toplarsın. Testler sayfanın HTML’ini değil, bu sınıfın metotlarını bilir.

```ts check title="e2e/pages/login-page.ts"
import type { Locator, Page } from '@playwright/test'

export class AccountPage {
  readonly page: Page
  readonly email: Locator
  readonly password: Locator
  readonly create: Locator

  constructor(page: Page) {
    this.page = page
    this.email = page.getByLabel('E-posta')
    this.password = page.getByLabel('Yeni parola')
    this.create = page.getByRole('button', { name: 'Üyeliği başlat' })
  }

  async goto() {
    await this.page.goto('/uye-ol')
  }

  async register(email: string, password: string) {
    await this.email.fill(email)
    await this.password.fill(password)
    await this.create.click()
  }
}
```

Etiket değişince **tek satır** değişir. Test ise hikâyeyi anlatır:

```ts
const accountPage = new AccountPage(page)
await accountPage.goto()
await accountPage.register('ada@example.test', 'ornek-parola')
await expect(page).toHaveURL('/rezervasyonlarim')
```

:::mistake[Sık hata]
**Belirti:** TypeScript, constructor içindeki kısa alan tanımını silemediği için derleme hatası verir. → **Neden:** `erasableSyntaxOnly` açıkken parameter property gibi runtime alanı oluşturan sözdizimleri kabul edilmez. → **Düzeltme:** Sınıf alanını ayrı tanımla, constructor’da `this.page = page` ata.
:::

### Etkileşimi adım adım izle

Bir kullanıcı etkinlik ayrıntı sayfasında yeri seçip kaydettiğinde üç sorumluluk oluşur. Test “koltuk ayırma” senaryosunu anlatır. Page object “A sırası 4 numarayı seç” gibi kullanıcı eylemini bilir. Fixture ise test için oturum veya başlangıç sayfası kurabilir. Bu sınırlar, arayüz etiketi değiştiğinde senaryo metninin değişmeden kalmasını sağlar.

| Katman | Ne zaman çalışır? | Örnekte yaptığı iş |
| --- | --- | --- |
| Fixture setup | Test başlamadan | Yeni page alır, gerekli sayfayı açar |
| Page object | Test çağırdığında | Yer seçimini doldurur ve kaydeder |
| Test assertion’ı | Eylemden sonra | Onay mesajının göründüğünü doğrular |
| Fixture teardown | Test bitince | Geçici kaynağı serbest bırakır |

Kırık yaklaşım, her testin aynı locator ve etkileşim dizisini kopyalamasıdır. Etiket değişince tüm dosyalarda düzeltme gerekir ve bekleme süreleri ayrışır. Doğru yapı, eylemleri tek yerde toplar ama testin beklenen ürün davranışını görünür bırakır:

~~~ts check
import { expect, test } from '@playwright/test'

test('seçilen yer kaydedilince onay gösterilir', async ({ page }) => {
  await page.goto('/seans/aksam')
  await page.getByRole('checkbox', { name: 'A sırası, 4 numara' }).check()
  await page.getByRole('button', { name: 'Yerimi ayır' }).click()
  await expect(page.getByRole('status')).toHaveText('Yer ayrıldı')
})
~~~

Page object eklemek her assertion’ı saklamak anlamına gelmez. Bir sınıf yalnızca HTML’i farklı isimlerle gizlerse okuma yükü artar; kullanıcı eylemi gibi gerçek bir kavramı temsil ediyorsa tekrar azalır.

### Assertion nerede durmalı?

- **Eylemler ve locator’lar** page object’te.
- **Doğrulamalar** çoğunlukla testte: “bu senaryoda ne bekliyoruz?” testin konusudur.
- İstisna: **senkronizasyon**. `findSession()` metodu “seans bilgisi görünene kadar” beklemeli ki onu çağıran her test aynı, doğru beklemeyi miras alsın. Beklemeyi her testte ayrı ayrı yazmak, dersin başındaki “ikisi ara sıra kalıyor” sorununun kaynağıdır.

Doğru beklemeyi seçmek önemli: yeni bir arama yazıldığında **eski** sonuçlar hâlâ ekrandadır. “İlk sonuç görünsün” diye beklersen eski sonuçla dönersin. “Bu sorgunun sonucu görünsün” diye bekle (örneğin “matrix” için sonuç başlığı).

## Fixture: testin ihtiyacını hazırla

Her testin başında `new LoginPage(page)` yazmak da bir tekrar. Fixture, testin parametre olarak **istediği** şeyi hazırlar; `page` de aslında Playwright’ın hazır bir fixture’ıdır.

```ts check title="e2e/fixtures.ts"
import { test as base, type Page } from '@playwright/test'

class CalendarPage {
  readonly page: Page
  constructor(page: Page) {
    this.page = page
  }
  async goto() {
    await this.page.goto('/search')
  }
}

export const test = base.extend<{ calendarPage: CalendarPage }>({
  calendarPage: async ({ page }, use) => {
    const calendarPage = new CalendarPage(page) // kurulum
    await calendarPage.goto()
    await use(calendarPage) // test burada çalışır
    // use'dan sonrası: temizlik (test kalsa bile çalışır)
  },
})
export { expect } from '@playwright/test'
```

```ts
import { expect, test } from './fixtures'

test('takvim programı gösterir', async ({ calendarPage }) => {
  // calendarPage hazır ve /takvim açık
})
```

- Fixture **tembeldir**: yalnızca onu isteyen testlerde kurulur.
- `use(…)`’dan önceki kod kurulum, sonraki kod temizliktir. Test kalsa bile temizlik çalışır (`try/finally` yazmana gerek yok).
- Varsayılan kapsam **test**: her teste yenisi. Pahalı ve paylaşılabilir şeyler için `{ scope: 'worker' }` ile işçi (worker) başına bir kez kurulabilir.
- Hazır fixture’lar: `page`, `context`, `browser`, `request` (tarayıcısız HTTP), `baseURL`.

Fixture bağımlılıkları zincir halinde olabilir. Örneğin `memberPage`, önce `page` ister, ardından oturumu kurup rezervasyon alanını açar. Playwright yalnızca testi tanımlanmış fixture’ları kurar; alakasız bir rapor testi bu hazırlığı ödemez. Worker kapsamlı fixture ise o worker içindeki testler arasında yaşar, test kapsamlı fixture her test için yeniden kurulur. Kapsamı seçerken değişebilirlik ve maliyeti birlikte tart.

Bir worker fixture içinde bir kullanıcı hesabını değiştirirsen aynı worker’daki sıradaki test başka başlangıç durumuyla karşılaşabilir. Bu yüzden mutable browser page’i worker seviyesinde paylaşmak çoğunlukla yalıtımı bozar. Pahalı ama salt okunur bir ortak config worker scope için daha uygundur. Testlerin paralel sayısı arttığında fixture scope’unun etkisini trace ve log üzerinden izlemek gerekir.

Page object metodunda bekleme koymanın ölçüsü de aynı olmalıdır: eylem tamamlandıktan sonra çağıran testin kullanacağı sayfa hazır hale gelmeli. Metot kendi içinde “rezervasyon başarılı” gibi her iş kuralını assert ederse başka akışlarda tekrar kullanılamaz. Yalnızca sayfa geçişinin tamamlanması gibi ortak UI hazır olma koşulunu bekle; ürünün iş sonucunu test senaryosu doğrulasın.

:::warning[ESLint ve `use`]
React Hooks kuralı fixture’daki `use(calendarPage)` çağrısını yanlışlıkla React’in `use()` hook’u sanabilir. Linter ayarını React kurallarını yalnızca uygulama kaynaklarına uygulatacak şekilde sınırla. İkinci parametreye başka bir ad vermek de çalışır ama Playwright belgeleriyle ayrışır.
:::

## Adımları okunur kılmak: `test.step`

Uzun bir senaryoyu adımlara bölersen HTML raporunda ve trace’te (7. ders) başlık başlık görünür:

```ts
await test.step('Giriş yap', async () => {
  await accountPage.register('ada@example.test', 'ornek-parola')
})
```

:::sector[Sektörde]
Page object en yaygın E2E düzeni; fixture ise Playwright’ın ona eklediği “bağımlılık enjeksiyonu”. Büyük paketlerde `test.extend` ile `accountPage`, `calendarPage`, hatta üye oturumu hazır bir `memberPage` fixture’ı görürsün. Aşırıya kaçma: her tıklamayı bir metoda sarmak testleri okunmaz kılar. Metotlar **kullanıcının niyetini** anlatmalı: `register`, `chooseSeat`, `openSession`.
:::

:::mistake[Fixture’ı her testte zorla kullanmak]
**Belirti:** Basit testlerde gereksiz sınıf ve dosya kurulumu vardır. → **Neden:** Fixture tekrar veya başlangıç ihtiyacı olmadan eklenmiştir. → **Düzeltme:** Önce doğrudan page ile yaz; ortak hazırlık ortaya çıkınca fixture’a taşı.
:::

## Özet

- Fixture başlangıç ve temizlik işini, page object sayfa eylemlerini, test senaryo beklentisini taşır.
- use öncesi kurulum, sonrası temizliktir; Playwright fixture yaşam döngüsünü tamamlar.
- Page object metotlarını kullanıcı niyetine göre adlandır.
- UI senkronizasyonunu ortaklaştır, ancak ürün beklentisini testten saklama.

**Kendini yokla:** Beklenen onay mesajı çoğunlukla hangi katmanda durur?  
*Cevap:* Testte; o senaryoda neyin doğru olduğunu açıkça anlatır.

**Kendini yokla:** Fixture neden temizliği use çağrısından sonra çalıştırır?  
*Cevap:* Testin bitişinden sonra geçici kaynakları bırakabilmek için.
