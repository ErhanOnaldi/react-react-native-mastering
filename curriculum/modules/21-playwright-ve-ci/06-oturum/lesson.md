---
title: "Oturumu storageState ile taşı"
minutes: 8
kind: concept
---

# Giriş testini her senaryoda tekrarlama

:::pain[Problem]
İzleme listesi testleri giriş formunu her seferinde dolduruyor. DummyJSON bazen yavaşlayınca bütün paket uzuyor; bir senaryoda parola hatası, diğerinde liste kaydetme hatası var ama ikisi aynı “Giriş yap” adımında kalıyor.
:::

## Oturum nerede duruyor?

Modül 17’de auth state’in kalıcı kısmını `localStorage`’a koydun. Playwright `storageState()` ile cookie ve localStorage’ı dosyaya kaydedebilir. Yeni bir browser context bu durumla başlar. Bir kez giriş yap, diğer testler aynı kimliği kullansın.

```ts title="e2e/auth.setup.ts"
import { test as setup, expect } from '@playwright/test'

setup('giriş durumunu kaydet', async ({ page }) => {
  await page.route('https://dummyjson.com/auth/login', (route) =>
    route.fulfill({ json: { id: 1, username: 'emilys', accessToken: 'test-access', refreshToken: 'test-refresh' } }),
  )
  await page.goto('/login')
  await page.getByLabel('Kullanıcı adı').fill('emilys')
  await page.getByLabel('Parola').fill('emilyspass')
  await page.getByRole('button', { name: 'Giriş yap' }).click()
  await expect(page).toHaveURL('/profile')
  await page.context().storageState({ path: 'playwright/.auth/user.json' })
})
```

`playwright/.auth` klasörünü `.gitignore`’a ekle: gerçek oturum dosyası sırdır. CI’da dosyayı her çalıştırmada yeniden üret. Proje görevinin ana giriş akışı ise **giriş formunu yine gerçek tarayıcıda yürütmeli**; `storageState` ile onu atlayıp router hatasını gizleme.

## Kullanım ve sınır

Birden çok spec giriş gerektiriyorsa setup project’i dependency yapıp `use.storageState` yolunu ver. Bu, aynı testten sonra yazılmış dosyayı okur. `page.context().storageState()` tüm oturumu yakalar; `page.evaluate(() => localStorage...)` ile elle kopyalama hatasına gerek kalmaz.

Aynı `storageState` ile açılan testler başlangıç kimliğini paylaşır; **canlı browser context’i paylaşmaz**. Bir testin listeye eklediği film başka testte otomatik görünmez. Sunucuda ortak kullanıcı verisi varsa her test için ayrı hesap veya temizleme gerekir.

:::mistake[Sık hata]
Kaydı giriş isteğinin bitmesini beklemeden alma. `await expect(page).toHaveURL('/profile')` gibi kullanıcıya görünen sonuçtan sonra kaydet. Token yenileme akışı varsa sahte auth servisinin `/auth/refresh` yanıtını da düşün.
:::

:::sector[Sektörde]
Giriş UI’sini bir E2E testinde yürüt; diğer testlerde `storageState` ile zamandan kazan. Yetkisiz yönlendirme için ayrıca boş oturumla açılan bir test tut.
:::
