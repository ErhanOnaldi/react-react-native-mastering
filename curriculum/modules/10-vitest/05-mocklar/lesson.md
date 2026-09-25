---
title: "Dış sınırı kontrol et"
minutes: 9
kind: concept
---

# Dış sınırı kontrol et

:::pain[Sinema’da ne oldu?]
`tmdbClient` testini gerçek TMDB’ye gönderince token ve ağ durumuna bağlı sonuç alırsın. Ayrıca `fetch` kaç kez ve hangi başlıklarla çağrıldı sorusuna cevap veremezsin.
:::

## Sorunu nasıl görürsün?

`vi.fn` çağrı geçmişi olan bir sahte fonksiyon kurar. `vi.stubGlobal("fetch", fake)` global sınırı değiştirir; test sonunda `vi.unstubAllGlobals()` ile geri al. `vi.spyOn` mevcut nesne metodunu izler; `vi.mock` ise tüm modül sınırını taklit eder.

## Uygulama

Başarı cevabını `Response.json({ title: "Dövüş Kulübü" })` ile verip URL, Bearer başlığı ve dönen sonucu ayrı denetle. Sonra 404 için `ApiError` sözleşmesini ölç. Vitest 5’te `clearMocks` varsayılan olarak true: çağrı geçmişi testler arasında temizlenir, sahte implementation korunur.

```ts title="tmdbClient.test.ts"
import { afterEach, expect, it, vi } from 'vitest'
import { tmdbClient } from './tmdbClient'

afterEach(() => vi.unstubAllGlobals())

it('ikinci arama sayfasını ister', async () => {
  const fakeFetch = vi.fn<typeof fetch>().mockResolvedValue(
    Response.json({ results: [{ id: 550, title: 'Dövüş Kulübü' }] }),
  )
  vi.stubGlobal('fetch', fakeFetch)
  await tmdbClient.get('/search/movie', { page: 2 })
  const [input, init] = fakeFetch.mock.calls[0]
  expect(new URL(String(input)).searchParams.get('page')).toBe('2')
  expect(new Headers(init?.headers).get('Authorization')).toMatch(/^Bearer /)
})
```

`vi.fn` yeni bir sahte fonksiyon üretir. `vi.spyOn`, `localStorage.setItem` gibi var olan bir metodu izleyip varsayılan olarak gerçek davranışını sürdürür. `vi.mock` bir modülü taklit eder; sınırı tek `fetch` çağrısıysa bütün modülü taklit etmek gereksiz geniştir.

## Sık hata

:::mistake
`vi.mock` hoist edilir; koşullu veya fonksiyon içi `vi.mock` Vitest 5’te hata verir. Modül taklidini ancak bütün modül sınırı gerektiğinde kullan.
:::

:::sector
Bir HTTP client testinde `fetch` sınırını taklit etmek hızlı geri bildirim verir; sonraki modülde MSW ile daha gerçekçi entegrasyon kurulacak.
:::
