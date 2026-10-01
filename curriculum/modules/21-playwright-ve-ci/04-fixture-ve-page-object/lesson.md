---
title: "Page object ve fixture’lar"
minutes: 16
kind: concept
---

# Page object ve fixture’lar

Sinema’da yeni bir hesap açarken `/uye-ol` sayfasını açıp e-posta ve parola girersin. Bunu yapan Playwright testinde `page.goto(...)` ve locator satırları vardır. Locator, ekrandaki bir öğeyi bulmak için kullandığın tanımdır. Aynı adımlar birkaç testte tekrar edince, arayüzdeki tek bir değişiklik de birkaç dosyayı düzeltmeni gerektirir.

## Tekrarlanan arama adımlarını adlandır

İlk test adımlarını doğrudan yazabilir:

```ts
await page.goto('/uye-ol')
await page.getByLabel('E-posta').fill('ada@example.test')
await page.getByLabel('Yeni parola').fill('ornek-parola')
await page.getByRole('button', { name: 'Üyeliği başlat' }).click()
```

Burada sayfayı açtın, iki alanı doldurdun ve üyelik eylemini başlattın. Bir testte birkaç kez tekrarlanınca alan etiketini veya buton adını değiştirmek her kopyayı düzeltmeyi gerektirir.

İkinci testte de aynı arama adımları gerekiyorsa bunları kullanıcı eylemi anlatan bir metotta toplayabilirsin. Böyle bir sınıfa **page object** denir: bir sayfanın locator’larını ve anlamlı kullanıcı eylemlerini bir araya getirir.

```ts check title="e2e/pages/membership-page.ts"
import { expect, type Locator, type Page } from '@playwright/test'

export class MembershipPage {
  readonly page: Page
  readonly email: Locator
  readonly password: Locator

  constructor(page: Page) {
    this.page = page
    this.email = page.getByLabel('E-posta')
    this.password = page.getByLabel('Yeni parola')
  }

  async goto() {
    await this.page.goto('/uye-ol')
  }

  async register(email: string, password: string) {
    await this.email.fill(email)
    await this.password.fill(password)
    await this.page.getByRole('button', { name: 'Üyeliği başlat' }).click()
    await expect(
      this.page.getByRole('heading', { name: 'Rezervasyon hesabın hazır' }),
    ).toBeVisible()
  }
}
```

Artık testte `membershipPage.register(...)` diyebilirsin. Metot alanları dolduruyor ve üyelik tamamlandığında görünen başlığı bekliyor; çağıran test bu ortak etkileşimin ardından güvenle devam eder. Daha sonra beklenen film adını veya hata mesajını doğrulamak ise senaryonun işi olarak testte kalır.

## Bir senaryoyu sayfa eylemleriyle tamamla

Bir film arama sayfası da aynı fikri kullanır: arama sonucu listesi bir süre eski filmi gösterebilir. Bu nedenle arama metodu sonuç listesinin herhangi bir öğesini değil, sorguyu taşıyan başlığı beklemelidir. Yalnızca mevcut metinleri okuyan bir metot kendi başına bekleme yapmaz; önce aramanın tamamlandığından emin olmak gerekir.

Bir sonraki adım, seçilen filmi açmak olsun:

```ts
async openSession(title: string) {
  await this.page.getByRole('link', { name: title, exact: true }).click()
  await expect(this.page.getByRole('heading', { level: 2, name: title })).toBeVisible()
}
```

Şimdi `openSession('Akşam seansı')` hem bağlantıya tıklar hem de seans ayrıntı başlığını bekler. Bu bekleme ortak bir sayfa geçiş şartıdır. “Bu senaryoda hangi seans açılmalı?” gibi ürün beklentisi yine testte görünür kalır. Her tıklamayı ayrı bir metoda çevirmek yerine `register` ve `openSession` gibi kullanıcı niyetini anlatan eylemleri seç.

## Başlangıç hazırlığını fixture’a taşı

Testler aynı sayfayı açmadan önce ortak bir hazırlık yapıyorsa page object’i her testte kurmak ve `goto()` çağırmak tekrar yaratır. **Fixture**, testin istediğinde aldığı ve önceden hazırlanan değerdir. Playwright’ın `{ page }` parametresi de hazır fixture’dır; Playwright her test için ayrı sayfa sağlar.

```ts check title="e2e/fixtures.ts"
import { test as base, type Page } from '@playwright/test'

class SchedulePage {
  readonly page: Page

  constructor(page: Page) {
    this.page = page
  }

  async goto() {
    await this.page.goto('/program')
  }
}

export const test = base.extend<{ schedulePage: SchedulePage }>({
  schedulePage: async ({ page }, use) => {
    const schedulePage = new SchedulePage(page)
    await schedulePage.goto() // Kurulum: testten önce çalışır.
    await use(schedulePage) // Playwright bu noktada test gövdesini çalıştırır.
    // Temizlik gerekiyorsa use'dan sonra yazılır.
  },
})
export { expect } from '@playwright/test'
```

Fixture’ı yalnızca isteyen test kurar. `schedulePage` istemeyen bir test bu sayfayı açmaz; bu yüzden ortak hazırlığı her teste zorla yüklememiş olursun. `use(...)` çağrısından önce kurulum, çağrıdan sonra temizlik çalışır. Test hata verse de Playwright temizlik bölümünü yürütür.

Page object ile fixture birbirinin alternatifi değildir. `SchedulePage` sayfadaki kullanıcı eylemlerini ve locator’ları tarif eder; fixture ise bu nesneyi ne zaman oluşturup hangi başlangıç sayfasını açacağını bilir. Birden çok test aynı program sayfasında başlıyorsa ikisini birlikte kullanırsın. Sadece bir testte işe yarayan tek seferlik locator içinse sınıf kurman gerekmez; doğrudan testte kullanmak daha nettir.

![Fixture, page object ve testin sorumlulukları](diagrams/test-sorumluluklari.svg "Hazırlık, sayfa eylemleri ve beklentiler ayrı katmanlarda kalır.")

| Sıra | Ne çalışır? | Bu örnekte ne olur? |
| --- | --- | --- |
| 1 | Fixture kurulumu | `SchedulePage` oluşur ve `/program` açılır. |
| 2 | `use(schedulePage)` | Hazır sayfa test gövdesine verilir. |
| 3 | Test gövdesi | Test programı inceler; hata verse bile akış kapanışa geçer. |
| 4 | Fixture temizliği | `use` sonrasındaki kaynak temizliği çalışır. |

Testte kullanımı kısa kalır:

```ts
test('üyelik sonrası program açılır', async ({ schedulePage }) => {
  await expect(schedulePage.page.getByRole('heading', { name: 'Bu akşam' })).toBeVisible()
})
```

Test gövdesi sayfanın nasıl açıldığını tekrar anlatmaz; fixture’ın verdiği hazır `schedulePage` ile neyi doğruladığını söyler. Başka bir test `schedulePage` istemezse bu hazırlık hiç yapılmaz. Başlangıç koşulunu ihtiyaç anında kurmak, gereksiz sayfa geçişlerini ve testi okumak için gereken adımları azaltır.

Bir eylem metodunun içinde bekleme olması da aynı amaca hizmet eder. Örneğin aramadan sonra sorgu başlığını beklemek, bu sayfayı kullanan her testin aynı doğru noktadan devam etmesini sağlar. Genel ürün iddialarını metoda saklama; onları testte bırak.

## Gerçek bir hata: her şeyi ortaklaştırmak

Page object’e her `click()` için yeni metot eklemek kısa vadede tekrar varmış gibi görünür ama testin hikâyesini takip etmeyi zorlaştırır. Sınıf yalnızca locator’lara başka isim takıyorsa, okur yine aynı arayüz ayrıntılarını çözmek zorunda kalır. Belirti, basit testin gereksiz sınıflar arasında dolaşmasıdır; düzeltme, yalnızca `search`, `openMovie` gibi tekrarlanan ve anlamlı eylemleri ortaklaştırmaktır.

Fixture da her testte kullanılacak bir zorunluluk değildir. Tek testlik küçük bir sayfa için doğrudan `{ page }` kullanmak daha anlaşılır olabilir. Ortak hazırlık birkaç testte gerçekten tekrar ettiğinde fixture’a taşı.

## Kapsamı şimdilik küçük tut

Bu örnekte fixture her test için yeni sayfayla kurulur. Böylece bir testin sayfadaki değişikliği sonraki teste sızmaz. Daha sonra maliyetli ortak hazırlıklarla karşılaşırsan worker scope seçeneğini değerlendirebilirsin; worker, testleri çalıştıran ayrı bir süreçtir.

:::info[Derinlemesine (isteğe bağlı)]
`{ scope: 'worker' }` fixture’ı bir worker içindeki testler arasında yaşatır. Değiştirilebilir bir kullanıcı oturumunu burada paylaşmak testleri birbirine bağlayabilir; bu nedenle önce yalıtımın neden bozulabileceğini düşün. TypeScript’te `erasableSyntaxOnly` açık projelerde constructor içine `public page: Page` yazmak yerine sınıf alanını tanımlayıp `this.page = page` atamak uyumlu yoldur.
:::

## Özet

- Page object locator’ları ve kullanıcı niyetini anlatan sayfa eylemlerini toplar.
- Ortak eylem, doğru kullanıcı arayüzü durumunu bekleyebilir; senaryonun ürün beklentisi testte kalır.
- Fixture testi istediği başlangıç koşuluyla hazırlar; `use` öncesi kurulum, sonrası temizliktir.
- Fixture tembeldir: yalnızca onu isteyen test için çalışır.

**Yeni terimler:**

- **Page object:** Bir sayfanın locator ve kullanıcı eylemlerini toplayan sınıf.
- **Fixture:** Test istediğinde hazırlanan ve testten sonra temizlenebilen değer.
- **Worker:** Testleri çalıştıran ayrı süreç; worker scope içindeki fixture o süreçte paylaşılır.

**Kendini yokla:** Testin beklediği “film ayrıntısı açıldı” sonucu çoğunlukla nerede doğrulanır?

*Cevap:* Testte; çünkü bu, belirli senaryonun ürün beklentisidir.

**Kendini yokla:** Test `schedulePage` istemiyorsa ilgili fixture ne yapar?

*Cevap:* Hiçbir şey; Playwright istenmeyen fixture’ı kurmaz.
