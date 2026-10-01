---
title: "Ağ taklidi: page.route"
minutes: 16
kind: concept
---

# Tarayıcı isteğine test cevabı ver

Sinema’da `/program` sayfasını açınca tarayıcı dış film servisine istek gönderebilir. Vitest’te MSW ile sahte yanıt verdiğini hatırlarsın. Playwright ise uygulamayı gerçek bir browser’da açar; Vitest sürecindeki MSW bu browser’ın isteklerini otomatik yakalamaz. Playwright’ın `page.route` metodu, tek bir sayfanın ağ isteğine test içinde yanıt vermeni sağlar.

## Önce tek bir yanıt dön

Bir **endpoint**, servisteki belirli bir iş için kullanılan adres yoludur. Diyelim ki Sinema’nın sayfası `https://api.sinema.test/program` adresinden programı alıyor. İlk olarak bu endpoint’e giden isteği yakalayıp bir **response** (sunucudan geri gelen HTTP yanıtı) verebilirsin:

```ts check
import { expect, test } from '@playwright/test'

test('program kartları örnek veriyle görünür', async ({ page }) => {
  await page.route('https://api.sinema.test/program', async (route) => {
    await route.fulfill({
      json: { items: [{ id: 21, title: 'Film gecesi' }] },
    })
  })

  await page.goto('/program')
  await expect(page.getByRole('link', { name: 'Film gecesi' })).toBeVisible()
})
```

`page.goto` öncesi kuralı kurduk. Böylece uygulamanın açılış isteği de test yanıtını alır. Uygulama `items` alanını okuyup kartı gösterir; test gerçek browser ve UI davranışını korurken dış servisin erişilebilir olmasına bağlı kalmaz.

## Arama değerine göre yanıtı seç

Sabit bir liste bazen yeterlidir, ama arama kutusu farklı sonuçlar göstermeli olabilir. URL’nin `?` işaretinden sonraki bölümüne **query string** denir; burada kullanıcı aramasını taşır. Route callback’i bu adresi okuyarak farklı yanıt verebilir:

```ts check
import { expect, test } from '@playwright/test'

test('program araması sorguya göre sonuç verir', async ({ page }) => {
  await page.route('https://api.sinema.test/filmler?**', async (route) => {
    const url = new URL(route.request().url())
    const title = url.searchParams.get('query') === 'matrix'
      ? 'Matrix'
      : 'Sonuç yok'

    await route.fulfill({ json: { items: [{ id: 7, title }] } })
  })

  await page.goto('/search')
  await page.getByRole('searchbox', { name: 'Film ara' }).fill('matrix')
  await expect(page.getByRole('link', { name: 'Matrix' })).toBeVisible()
})
```

`new URL(...)` adresi parçalara ayırır; `searchParams.get('query')` ise arama değerini güvenilir biçimde okur. Aramadaki Türkçe karakterler URL içinde kodlanabileceği için ham metinde `query=dövüş` aramak kırılgandır. Parametre okuyucu kodlanmış değeri çözer.

Bu örnek, boş sonuç için de aynı veri biçimini kullanabilir. Örneğin sorgu `bilinmeyen` ise `items: []` dön. Böylece uygulamanın arama tamamlandı durumunu ve boş ekranını ayrı test edebilirsin; yanlış biçimde `null` veya film dizisinin kendisini döndürmek UI’nin beklediği veri yapısını bozabilir.

## İstek başlığını da kontrol et

Bazı servisler istekte kimlik bilgisi bekler. HTTP **header**’ı, isteğe eklenen küçük bir bilgidir; Authorization header hangi kullanıcı yetkisiyle istek gittiğini taşır. Eksik başlığı başarıyla yanıtlamak, oturum hatasını saklar.

```ts check
import { expect, test } from '@playwright/test'

test('seans listesi yalnızca oturumla gelir', async ({ page }) => {
  await page.route('https://api.sinema.test/seanslar?**', async (route) => {
    const authorized = route.request().headers().authorization === 'Bearer test-token'

    if (!authorized) {
      await route.fulfill({ status: 401, json: { message: 'Oturum gerekli' } })
      return
    }

    const url = new URL(route.request().url())
    const items = url.searchParams.get('film') === 'matrix'
      ? [{ id: 8, title: 'Matrix — 20:30' }]
      : []

    await route.fulfill({ json: { items } })
  })

  await page.goto('/seanslar')
  await expect(page.getByRole('alert')).toHaveText('Oturum gerekli')
})
```

Bu kez route başlığı okuyor. Yetki yoksa `401` (kimlik doğrulama gerekiyor) döner; izin varsa sorguya göre liste verir. Arayüz de gerçekçi hata yolundan geçer. Başarılı akışta test token’ı bulunan bir oturum kurulur; başka senaryoda eksik token ile bu hata görünür.

## İsteğin yolculuğunu sırayla izle

Route’u geç kurarsan ilk isteği kaçırabilirsin. Ekranda görünen “İlk istekte TMDB’ye bağlandı” ya da gerçek ağ trafiği, bunun belirtisidir. Sıra şöyle işler:

| Sıra | Olay | Ne olur? |
| --- | --- | --- |
| 1 | Route kaydı eklenir | Eşleşme kuralı hazırdır. |
| 2 | `page.goto` sayfayı açar | Browser uygulama kaynaklarını yükler. |
| 3 | Uygulama dış servise istek yollar | İstek Playwright route’una gelir. |
| 4 | Route URL/header okur ve yanıt verir | Gerçek servise çıkmadan test verisi döner. |
| 5 | Uygulama yanıtı işler | UI listeyi veya hata mesajını gösterir. |

Bu nedenle ilk gezinmeden önce route kur. Route’u `page.goto` sonrasına alırsan uygulama açılış isteğini kuraldan önce gönderebilir. Geçmiş bir istek için route sonradan yanıt üretmez.

Başarı ve hata durumunu da farklı testlerde görünür tut. Başarılı bir senaryoda liste bağlantısını beklersin; yetkisiz senaryoda `401` cevabıyla gelen hata mesajını beklersin. Aynı testte önce başarı verip sonra hata cevabı üretmek sonucu belirsizleştirir: hangi yanıtın ekranda kaldığını anlamak güçleşir. Ayrı testler, her birinin hangi koşulu kanıtladığını açık eder.

Route kuralı da olabildiğince hedefe yakın olsun. Sadece `/seanslar` isteğini yakalıyorsan, `https://api.sinema.test/**` gibi tüm API’yi kapsayan desen kullanma. Geniş bir desen film aramasını veya profil isteğini yanlışlıkla aynı yanıtla karşılayabilir. Dar eşleşme, ilgisiz isteklerin gerçek uygulama yolunda kalmasını sağlar.

Route callback’inde `route.request()` ile gelen isteği inceler, `route.fulfill()` ile kendi yanıtını verirsin. Her istekte başarılı kod varsayılan olabilir; ancak hata senaryosunda `status: 500` gibi bir HTTP durumu açıkça belirtmek gerekir. Gövde metni kullanıcıya gösterilen hatayla uyuşsun. Böylece test hem neden isteğin başarısız olduğunu hem de UI’nin bu durumu nasıl anlattığını doğrular.

## Yanıtın biçimi de davranışın parçası

Kırık bir örnek film dizisini doğrudan verir:

```ts
await route.fulfill({ json: [{ id: 21, title: 'Film gecesi' }] })
```

Bu cevap JSON’dur, ama uygulama `{ items: [...] }` bekliyorsa doğru yanıt değildir. Belirti olarak liste boş kalabilir ya da uygulama veri okurken hata verir. Cevabı uygulamanın gerçekten kullandığı alanlarla düzelt:

```ts
await route.fulfill({ json: { items: [{ id: 21, title: 'Film gecesi' }] } })
```

Her endpoint’in sözleşmesini korumak önemlidir. Arama yanıtı film sonuçlarını, oturum yanıtı kullanıcı bilgisini bekleyebilir; her URL’ye aynı genel JSON’u vermek hataları gizler.

MSW ve Playwright route aynı işi farklı çalışma yerlerinde yapar. MSW Vitest’in test sürecindeki uygulama isteğini yakalar; Playwright route browser’dan çıkan isteği yakalar. E2E’de sayfanın kendisini, gerçek tarayıcı etkileşimini ve uygulamanın yanıtı işleme şeklini sınarsın; dış servisin o an çalışıp çalışmamasını sabitlersin.

:::info[Derinlemesine (isteğe bağlı)]
Tek sayfa için `page.route` yeterlidir. Popup veya yeni sekme de aynı testin parçasıysa `browserContext.route` ile aynı browser context’indeki sayfaları kapsayabilirsin. Bir service worker isteği route’tan önce ele alıyorsa normal interception davranışı değişebilir; bu, özel test ortamında ayrıca incelenmesi gereken ileri bir durumdur.
:::

## Özet

- `page.route` browser isteğini yakalar; route’u ilk gezinmeden önce kur.
- URL ve query parametrelerini okuyarak farklı sorgulara farklı yanıtlar verebilirsin.
- Yanıt gövdesi uygulamanın beklediği alanları taşımalı.
- Kimlik gerektiren isteklerde yetkisiz durumu başarı cevabıyla gizleme.

**Yeni terimler:**

- **Endpoint:** Serviste belirli bir iş için çağrılan adres yolu.
- **Response:** İsteğe geri dönen HTTP yanıtı ve gövdesi.
- **Query string:** URL’de `?` sonrasında taşınan parametreler.
- **Header:** İsteğe veya yanıta eklenen HTTP bilgisi.

**Kendini yokla:** Neden route’u `page.goto` öncesinde kaydediyoruz?

*Cevap:* Uygulama açılışta istek gönderebilir; sonradan eklenen kural bu isteği yakalayamaz.

**Kendini yokla:** `items` bekleyen uygulamaya neden yalnızca film dizisi döndürmek yetmez?

*Cevap:* Uygulama yanıtın `{ items: [...] }` biçiminde olacağını varsayar.
