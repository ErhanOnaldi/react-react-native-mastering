---
title: "Oturum durumunu sonraki testlere taşı"
minutes: 16
kind: concept
---

# Giriş testini her senaryoda tekrarlama

Bir Playwright testi her çalıştığında yeni bir **browser context** alır: tarayıcıdaki cookie, localStorage ve sayfa durumunu kendi içinde tutan ayrı bir oturum alanı. Böylece testler birbirlerinin açık sayfasını değiştirmez. Ama her test üyelik formunu doldurup dış kimlik servisini beklerse paket yavaşlar ve basit bir rezervasyon hatasını giriş sorunundan ayırmak zorlaşır.

Girişten sonraki başlangıç durumunu saklayıp başka testlerde kullanabilirsin. Playwright bu cookie ve localStorage kopyasına `storageState` der. Dosya yeni bir context’in başlangıç verisi olur; canlı sayfa veya sunucu veritabanı kopyalanmaz.

## Önce girişin gerçekten bittiğini bekle

Üyelik formunu doldurup giriş butonuna tıkladığını düşün. Bu satır hemen ardından çalışırsa oturum henüz tarayıcıya yazılmamış olabilir:

```ts
await page.context().storageState({ path: 'playwright/.auth/member.json' })
await page.getByRole('button', { name: 'Giriş yap' }).click()
```

Belirti, kaydedilen dosyayı kullanan testin yeniden giriş sayfasına dönmesidir. Dosya tıklamadan önce yazılmıştır; yani oturum verisi henüz yoktur.

Önce giriş sonrası görünen bir işareti bekle, sonra kaydet:

```ts check
import { expect, test } from '@playwright/test'

test('üyelikten sonra profil açılır', async ({ page }) => {
  await page.goto('/uye-ol')
  await page.getByLabel('E-posta adresin').fill('ada@example.test')
  await page.getByLabel('Yeni parola').fill('ornek-parola')
  await page.getByRole('button', { name: 'Üyeliği başlat' }).click()
  await expect(page.getByRole('heading', { name: 'Hesabın hazır' })).toBeVisible()
  await page.context().storageState({ path: 'playwright/.auth/member.json' })
})
```

Şimdi sıra nettir: formu gönder, uygulamanın giriş sonrası durumunu gösterdiğini doğrula, ancak ondan sonra tarayıcı durumunu dosyaya yaz. Görünür başlık, kullanıcı akışının tamamlandığına dair kanıttır; sabit bir `waitForTimeout` süresinden daha anlamlıdır.

| Sıra | Nerede? | Olay | Neden bu sıra? |
| --- | --- | --- | --- |
| 1 | Setup sayfası | Üyelik formu gönderilir | Oturum akışı başlar. |
| 2 | Aynı sayfa | `Hesabın hazır` başlığı beklenir | UI girişin tamamlandığını gösterir. |
| 3 | Setup context | `storageState` dosyası yazılır | Cookie/localStorage artık hazırdır. |
| 4 | Rezervasyon testi | Yeni context dosyayı yükler | Test hazır başlangıç kimliği alır. |
| 5 | Test bitişi | Yeni context kapanır | Canlı sayfa sonraki teste taşınmaz. |

![Bir giriş setup’ı storageState üretir, testler bunu ayrı context’lerde kullanır](diagrams/oturum-yeniden-kullanimi.svg "Giriş başlangıcını paylaş; testlerin browser context’lerini ayır.")

## Aynı başlangıçla ayrı testler aç

Tek bir testi state dosyasıyla başlatmak için Playwright testinin `use` ayarına dosya yolunu verebilirsin:

```ts title="playwright.config.ts içinden"
use: {
  storageState: 'playwright/.auth/member.json',
}
```

Bu test dosyadaki başlangıç durumunu kendi context’ine yükler. İkinci test aynı dosyayı kullanabilir; ikisi aynı cookie/localStorage verisiyle başlar ama birbirinin canlı sayfasını paylaşmaz. Biri arama filtresini değiştirirse diğeri o UI değişikliğini görmez.

Birden çok dosya bu oturuma ihtiyaç duyuyorsa Playwright config’te bir **setup project** tanımlayabilirsin. Bu, testten önce çalışan proje grubudur; ona bağımlı proje ancak setup tamamlandıktan sonra başlar:

```ts
projects: [
  {
    name: 'auth-setup',
    testMatch: /auth\.setup\.ts/,
  },
  {
    name: 'chromium',
    dependencies: ['auth-setup'],
    use: {
      ...devices['Desktop Chrome'],
      storageState: 'playwright/.auth/member.json',
    },
  },
]
```

Setup dosyası formu gerçek browser’da yürütür ve giriş sonrası state’i üretir. Chromium testleri sonra bu dosyayı okur. Böylece girişin çalıştığını en az bir setup akışında görürsün, diğer senaryolar da aynı yavaş akışı tekrar etmek zorunda kalmaz.

Setup başarısızsa bağımlı testlerin başlamaması da önemlidir. Örneğin test hesabının parolası değişmiş ve giriş artık tamamlanmıyorsa eski state dosyasını sessizce kullanmak, bozuk bir setup’ı gizler. Setup projesi her Playwright çalıştırmasında state’i taze üretmeli; giriş sonrası başlık görünmüyorsa hata burada açıkça ortaya çıkmalıdır. CI’da da bu dosyayı test çalışmasından önce saklı bir artifact olarak taşımak yerine, test hesabıyla baştan üret.

## Hazır oturum ana giriş yolunu gizlemesin

Bir uygulamanın login akışında hata varsa her testi hazır state ile başlatmak bu hatayı saklayabilir. En az bir E2E akışı boş context’ten başlasın, korumalı bir sayfayı açmaya çalışsın, giriş formunu tamamlasın ve hedef sayfaya ulaştığını doğrulasın. Bu test giriş ekranı ile route bağını gerçekten yürür.

Diğer testler ise giriş sonrası işlere odaklanabilir: örneğin profilinde bir filmi favoriye eklemek veya programdan seans seçmek. Bu ayrım her senaryoda aynı yavaş başlangıcı tekrarlamaz ve temel giriş yolculuğuna da gerçek bir kontrol bırakır.

## Tarayıcı state’i uzak veritabanı değildir

storageState iki ayrı testte aynı kullanıcı kimliğini başlatabilir. Yine de her testin browser context’i ayrıdır. Ancak iki test aynı uzak hesapta rezervasyon oluşturursa sunucudaki kayıtlar ortak kalabilir. Bir testin eklediği rezervasyonun sonraki testte görünmesi, tarayıcı yalıtımının değil ortak server verisinin belirtisidir. Test başına farklı kayıt üret veya sonunda kaydı temizle.

State dosyası erişim token’ı veya kişisel bilgi taşıyabilir. `playwright/.auth` yolunu `.gitignore`’a ekle ve gerçek kullanıcının oturumunu repoya koyma. CI’da test hesabıyla her çalıştırmada yeniden üretmek, eski veya paylaşılmış bir oturum dosyasına bel bağlamanı önler.

Bu iki veri alanını karıştırma: context’in localStorage’ı ayrı olsa bile API sunucusu aynı kullanıcı kaydını görür. Bir favori ekleme testi, başka bir testin beklediği favori listesini değiştirebilir. Senaryolar ortak server verisini değiştiriyorsa farklı test hesapları kullanmak veya test sonunda favoriyi kaldırmak gerekir. Başlangıç state’i sadece tarayıcıyı hazırlar; test verisini otomatik temizlemez.

:::info[Derinlemesine (isteğe bağlı)]
`storageState` cookie ve localStorage’ı kapsar; sessionStorage’ı kendiliğinden kaydetmez. Uygulama kimliği yalnız sessionStorage’da tutuyorsa farklı bir kurulum gerekir. Token süresi doluyorsa setup’ı her Playwright çalıştırmasında yeniden çalıştır; rol bazlı testler için de her role uygun ayrı başlangıç state’i üret.
:::

## Özet

- `storageState` giriş sonrası cookie ve localStorage’ı bir dosyaya kaydeder.
- Dosyayı UI girişin bittiğini gösterdikten sonra yaz; kısa süre tahmin edip bekleme.
- Testler aynı state’i yüklese de kendi ayrı browser context’lerinde çalışır.
- Giriş akışını boş oturumdan en az bir kez yürü; uzak server kayıtlarını ayrıca yalıt.

**Yeni terimler:**

- **Browser context:** Cookie, localStorage ve sayfa durumunu tutan ayrı tarayıcı oturumu.
- **`storageState`:** Cookie ve localStorage başlangıcını saklayan Playwright durumu.
- **Setup project:** Bağımlı test projelerinden önce çalışan hazırlık projesi.

**Kendini yokla:** Neden `storageState` kaydından önce giriş sonrası başlığı bekliyoruz?

*Cevap:* Böylece dosyaya oturum kurulmadan önceki boş durum değil, hazır giriş durumu yazılır.

**Kendini yokla:** Ayrı context kullanan testlerde bir rezervasyon neden yine de diğerinde görünebilir?

*Cevap:* Rezervasyon server’daki ortak veridir; context ayrılığı browser verisini ayırır, veritabanını değil.
