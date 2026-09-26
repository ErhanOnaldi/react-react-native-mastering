---
title: "Ağ taklidi: page.route"
minutes: 9
kind: concept
---

# Ağı tarayıcıda kontrol etmek

:::pain[Problem]
Sinema arama E2E testi kendi bilgisayarında geçiyor, CI’da TMDB kota sınırına takılıyor. Başka gün “Dövüş Kulübü” sonucunun sırası değişiyor. `server.use` ile yazdığın MSW taklidi Vitest sürecinde çalışır; Playwright’ın açtığı Vite sayfasındaki istekleri otomatik yakalamaz.
:::

## Önce isteği gözle

DevTools Network sekmesinde arama, `GET https://api.themoviedb.org/3/search/movie?query=...` isteği atıyor. Testte gerçek servise bağımlı kalırsan sonuç, süre ve 401 durumunu denetleyemezsin. Playwright’ın `page.route` metodu tarayıcının isteğini yakalar; `route.fulfill` yanıtı verir.

```ts check title="e2e/search.spec.ts"
import { test, expect } from '@playwright/test'

test('arama sabit TMDB verisiyle çalışır', async ({ page }) => {
  await page.route('https://api.themoviedb.org/3/search/movie?**', async (route) => {
    const url = new URL(route.request().url())
    const results = url.searchParams.get('query') === 'dövüş'
      ? [{ id: 550, title: 'Dövüş Kulübü', release_date: '1999-10-15', vote_average: 8.4 }]
      : []
    await route.fulfill({ json: { page: 1, results, total_pages: 1, total_results: results.length } })
  })
  await page.goto('/search')
  await page.getByRole('textbox', { name: 'Film ara' }).fill('dövüş')
  await expect(page.getByRole('link', { name: 'Dövüş Kulübü' })).toBeVisible()
})
```

Route’u **`page.goto` öncesi** kur. Uygulama açılışta istek atarsa sonradan kurulan route geç kalır. Yanıt, uygulamanın beklediği TMDB şekline uymalı; tek film nesnesi yerine `results` dizisi gerekir. Sahte veride `550` başlığı “Dövüş Kulübü”; Türkçe fikstürle uyumlu ol.

## Aynı fikir, yeni durum

Modül 11’de `server.use` ile tek teste 500 yanıtı veriyordun. Tarayıcıda karşılığı:

```ts
await page.route('https://api.themoviedb.org/3/movie/550**', (route) =>
  route.fulfill({ status: 500, json: { status_message: 'Servis geçici olarak kapalı' } }),
)
await page.goto('/movie/550')
await expect(page.getByRole('alert')).toContainText('Filmler yüklenemedi')
```

Bu kez hata sayfasını ve erişilebilir `alert` rolünü birlikte sınarsın. Gerçek uygulamada hata metni farklıysa assertion’ı kendi UI sözleşmene göre yaz.

## Girişte farklı servis

DummyJSON `POST /auth/login` kullanır. `route.request().method()` ve `route.request().postDataJSON()` ile isteği denetle; doğru kullanıcı için `accessToken`, `refreshToken`, `id`, `username` döndür. Yanlış parola için 400 döndür. Böylece “giriş yap → izleme listesi” testi internete çıkmadan router’ın gerçekten doğru bağlandığını görür.

:::mistake[Sık hata]
`page.route` yalnızca verilen sayfanın isteklerini yakalar. Yeni tab açılıyorsa `context.route` kullan. Servis worker’ların yönettiği isteklerde route taklidi çalışmayabilir; E2E ortamında ilgili worker’ı kapatmayı düşün. TMDB’ye eksik `Authorization: Bearer …` gönderen uygulamayı sahte API ile gizleme: en az bir senaryoda başlığı kontrol et ve 401 döndür.
:::

:::sector[Sektörde]
Fikstürleri küçük ve amaca uygun tut. Ana akışı sabit veriyle, hata durumunu ayrı testle kontrol et. Her şeyi taklit etmek yerine gerçekten görmek istediğin katmanı (router, UI, form) açık bırak.
:::
