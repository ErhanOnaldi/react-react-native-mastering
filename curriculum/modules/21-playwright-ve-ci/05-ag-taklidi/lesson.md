---
title: "Ağ taklidi: page.route"
minutes: 14
kind: concept
---

# Ağı tarayıcıda kontrol etmek

:::pain[Problem]
Etkinlik arama E2E testi kendi bilgisayarında geçiyor, CI’da katalog servisi yanıt vermiyor. Başka gün program sırası değişiyor. `server.use` ile yazdığın MSW taklidi Vitest sürecinde çalışır; Playwright’ın açtığı browser’daki istekleri otomatik yakalamaz.
:::

## Önce isteği gözle

:::model[MSW perdesi]
Vitest içinde MSW, uygulamanın yaptığı fetch isteğini yakalar ve tanımlı handler cevabını döndürür. Playwright ise uygulamayı ayrı bir tarayıcı sürecinde açar; Node test sürecindeki MSW handler’ı tarayıcıya otomatik geçmez. Tarayıcı ağını test başında page veya context rotasıyla karşıla.

![Uygulama fetch çağrısı MSW tarafından yakalanıp handler yanıtına döner](diagram:msw-perdesi)
:::

Bu modelde değişen yer, isteği kimin yakaladığıdır. RTL testinde MSW, jsdom içindeki uygulama sürecine yakın durur. Tarayıcı E2E’de Playwright route, browser context’in dış ağ isteğini yakalar. İkisinde de uygulama aynı fetch API’sini çağırır; test ağı, cevabın gerçek servisten gelmesini engeller.

Kesin kurallar:

1. Route’u ilk gezinmeden önce kur; uygulama açılırken istek atıyorsa sonradan eklenen kural geç kalır.
2. Adres eşleşmesini dar tut; yalnızca hedef origin ve endpoint yakalansın.
3. Cevap gövdesi uygulamanın beklediği veri sözleşmesine uysun. Liste yanıtı tek kayıt değil, sonuç dizisi ve sayfalama alanları taşır.
4. İstek metodunu, query değerlerini ve gerekli başlıkları talep olduğunda kontrol et.
5. Bilinmeyen ya da yetkisiz istek başarı gibi görünmemeli; gerçek hata koşulunu açıkça döndür.
6. Yeni sekme açılabilen senaryoda page yerine context rotası kur; tüm sekmeler ortak bağlamdan geçer.

## Yanıtı zaman sırasıyla izle

Kullanıcı bir etkinlik arar. UI fetch yapar; tarayıcı Playwright route kuralına ulaşır; test URL ve Authorization bilgisini okuyup cevabı hazırlar; uygulama HTTP yanıtını JSON’a çevirir; bileşen listeyi gösterir. E2E bu zincirde gerçek tarayıcı, UI ve router’ı bırakır, yalnızca dış servisin yanıtını sabitler.

| Sıra | Olay | Testin sağladığı kanıt |
| --- | --- | --- |
| 1 | Route kaydı eklenir | Uygulama başlamadan önce kural hazır |
| 2 | Uygulama isteği yollar | İstek browser’dan çıkar |
| 3 | URL ve başlık okunur | Doğru query ve kimlik başlığı var |
| 4 | JSON cevap döner | Uygulama gerçek servis olmadan devam eder |
| 5 | UI güncellenir | Kullanıcının gördüğü sonuç test edilir |

Kırık örnek sadece query parametresini yakalar, ama yanıt gövdesini yanlış şekillendirir:

~~~ts
await page.route('https://api.etkinlik.example/program**', (route) =>
  route.fulfill({ json: [{ title: 'Film gecesi' }] }),
)
~~~

Uygulama `{ items: [...] }` bekliyorsa bu yanıt doğru veriye benzese bile sözleşmeye uymaz. Düzeltilmiş route aynı senaryoda liste zarfını ve yetki kontrolünü verir:

~~~ts check
import { expect, test } from '@playwright/test'

test('program listesi test verisiyle açılır', async ({ page }) => {
  await page.route('https://api.etkinlik.example/program**', async (route) => {
    const authorized = route.request().headers().authorization === 'Bearer demo'
    if (!authorized) return route.fulfill({ status: 401, json: { message: 'Oturum gerekli' } })
    await route.fulfill({ json: { items: [{ id: 4, title: 'Film gecesi' }] } })
  })
  await page.goto('/program')
  await expect(page.getByRole('link', { name: 'Film gecesi' })).toBeVisible()
})
~~~

Üretimdeki hata sayfasını da sınamak istiyorsan route’u bilerek 500 veya 401 cevabı verecek şekilde değiştir. Aynı testte başarı ve hata davranışını karıştırmak yerine ayrı senaryolar kurmak, birinin kanıtını diğerinin etkisinden ayırır.

DevTools Network sekmesinde arama, `GET https://api.etkinlik.example/program?query=...` isteği atıyor. Testte gerçek servise bağımlı kalırsan sonuç, süre ve 401 durumunu denetleyemezsin. Playwright’ın `page.route` metodu tarayıcının isteğini yakalar; `route.fulfill` yanıtı verir.

```ts check title="e2e/search.spec.ts"
import { test, expect } from '@playwright/test'

test('program araması sabit katalogla çalışır', async ({ page }) => {
  await page.route('https://api.etkinlik.example/program?**', async (route) => {
    const url = new URL(route.request().url())
    const results = url.searchParams.get('query') === 'seramik'
      ? [{ id: 42, title: 'Seramik atölyesi' }]
      : []
    await route.fulfill({ json: { items: results } })
  })
  await page.goto('/program')
  await page.getByRole('searchbox', { name: 'Etkinlik ara' }).fill('seramik')
  await expect(page.getByRole('link', { name: 'Seramik atölyesi' })).toBeVisible()
})
```

Route’u **`page.goto` öncesi** kur. Uygulama açılışta istek atarsa sonradan kurulan route geç kalır. Yanıt, uygulamanın beklediği liste biçimine uymalı; burada `items` alanı bir dizi taşır.

## Aynı fikir, yeni durum

Modül 11’de `server.use` ile tek teste 500 yanıtı veriyordun. Tarayıcıda karşılığı:

```ts
await page.route('https://api.etkinlik.example/venues/42/sessions', (route) =>
  route.fulfill({ status: 500, json: { message: 'Program geçici olarak kapalı' } }),
)
await page.goto('/mekan/42')
await expect(page.getByRole('alert')).toContainText('Program yüklenemedi')
```

Bu kez hata sayfasını ve erişilebilir `alert` rolünü birlikte sınarsın. Gerçek uygulamada hata metni farklıysa assertion’ı kendi UI sözleşmene göre yaz.

## Girişte farklı servis

Bir üyelik akışında `POST /session` isteğini de taklit edebilirsin. `route.request().method()` ve `route.request().postDataJSON()` ile e-posta alanını denetle; geçerli kayıt için kullanıcı kimliği döndür, geçersiz kayıt için 400 yanıtı ver. Böylece form ve yönlendirme gerçek browser’da çalışırken dış servis deterministik kalır.

:::mistake[Sık hata]
**Belirti:** İlk sayfa isteği gerçek ağa çıkar. → **Neden:** Route gezinmeden sonra kurulmuştur. → **Düzeltme:** Route kaydını page.goto öncesine taşı.
:::

:::mistake[Yanlış yanıt gövdesi]
**Belirti:** UI boş kalır veya parse hatası verir. → **Neden:** Taklit, API’nin veri zarfını taşımamıştır. → **Düzeltme:** Uygulamanın okuyacağı alanları ve türleri yanıt gövdesinde koru.
:::

:::mistake[Başlık hatasını gizlemek]
**Belirti:** Eksik Authorization ile bile başarılı liste gösterilir. → **Neden:** Route her isteğe aynı olumlu cevabı verir. → **Düzeltme:** Yetkisiz dal için 401 döndür ve en az bir akışta başlığı doğrula.
:::

## Route kapsamı ve senaryo ayrımı

Bir sayfa birden fazla dış origin’e bağlanıyorsa her servis için ayrı cevap sözleşmesi kur. Arama servisi liste zarfı, kimlik servisi ise oturum alanları döndürebilir; aynı genel JSON yanıtını tüm adreslere vermek uygulamanın gerçek sınırlarını örtemez. Testte önemli olan bütün API şemasını kopyalamak değil, senaryoda UI’nin kullandığı alanları doğru tür ve anlamla sağlamaktır.

Route callback’i istek metodu, URL ve header’ları okuyabilir. Böylece yanlışlıkla POST bekleyen bir akış GET göndermişse ya da Authorization eksikse test bunu başarılı cevapla örtmez. Sabit veride de gerçekçi başarısızlık dalını tut: 401 kimlik bilgisini, 500 geçici servis arızasını, boş liste ise başarılı ama sonuçsuz aramayı temsil eder. Bunlar kullanıcıya farklı UI durumları gösterir.

Page route ile context route arasındaki seçim testin kurulumuna bağlıdır. Tek page açıyorsan page.route kolaydır; yeni sekme, popup veya birden fazla page kullanılıyorsa context.route daha geniş kapsamdadır. Route eşlemesini gereğinden fazla geniş tutarsan ilgisiz endpoint’leri de yanlış yanıtlayıp testi geçirebilirsin. Kuralın kapsadığı URL kalıbını ve metodunu senaryo ihtiyacına göre daralt.

Service worker tarafından yakalanan ağ trafiği normal route akışından farklı davranabilir. Bir uygulamada service worker varsa test ortamında cache ve intercept davranışını ayrıca düşün; her istek doğrudan page.route’a ulaşmayabilir. Bu ayrıntı route taklidinin yanlış olduğu anlamına gelmez, ama tarayıcıda hangi katmanın isteği önce gördüğünü bilmek gerekir.

Kırık örnekte tüm istekler koşulsuz başarılıdır:

~~~ts
await page.route('https://api.etkinlik.example/**', (route) =>
  route.fulfill({ json: { items: [] } }),
)
~~~

Bu kural arama, oturum ve ayrıntı isteklerini aynı gövdeye indirger. Düzeltilmiş tasarım her endpoint’in ihtiyacını ayrı karşılar; yetkisiz istek de ayrı bir yanıt alır. Testin uygulama kodunu değil, dış servis sınırını kontrol etmesi korunur.

:::sector[Sektörde]
Fikstürleri küçük ve amaca uygun tut. Ana akışı sabit veriyle, hata durumunu ayrı testle kontrol et. Her şeyi taklit etmek yerine gerçekten görmek istediğin katmanı (router, UI, form) açık bırak. MSW ve Playwright route aynı dış sistem sınırını farklı test çalışma alanlarında kontrol eder.
:::

## Özet

- MSW, Vitest tarafındaki ağ perdesidir; Playwright route tarayıcının dış isteklerini yakalar.
- Route’u ilk istekten önce kur ve endpoint’i dar eşleştir.
- Yanıt gövdesi gerçek veri sözleşmesine uysun; yetkisiz ve hata yanıtlarını başarı gibi gizleme.
- Gerçek tarayıcı ve uygulama UI’si testte kalır; dış API cevabı kontrol edilir.

**Kendini yokla:** Vitest MSW handler’ı Playwright tarayıcısının isteğini neden kendiliğinden yakalamaz?  
*Cevap:* Tarayıcı farklı süreçtedir; Playwright network route’u ayrı bağlanır.

**Kendini yokla:** Route’u sayfa açıldıktan sonra kaydetmek neden risklidir?  
*Cevap:* Açılış isteği kural kurulmadan çıkmış olabilir.
