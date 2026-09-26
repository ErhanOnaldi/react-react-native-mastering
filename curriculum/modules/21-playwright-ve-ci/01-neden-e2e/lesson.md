---
title: "Testler yeşil, akış kırık: neden E2E?"
minutes: 9
kind: concept
---

# Testler yeşil, akış kırık: neden E2E?

:::pain[Sinema’da sorun]
Pazartesi sabahı gelen mesaj: “Giriş yap’a basıyorum, sayfa bomboş. Üstte menü var, form yok.” CI’da Vitest paketi **yeşil**. Hata, cuma günkü “temizlik” commit’inde:
:::

```tsx title="src/router.tsx"
{
  element: <AuthenticatedPages />, // korumalı grup: girişi olmayanı /login'e yollar
  children: [
    { path: 'watchlists', lazy: … },
    { path: 'profile', lazy: … },
    { path: 'login', lazy: … }, // [!code ++]
  ],
},
{ path: 'login', lazy: … }, // [!code --]
```

“Giriş de auth ile ilgili, onların yanında dursun” diye taşınan tek satır. Artık girişi olmayan kullanıcı `/watchlists`’e gidince `/login`’e yönleniyor; `/login` de korumalı olduğu için **yine** `/login`’e yönleniyor. Form hiç render edilmiyor.

## Testler neden yakalamadı?

Her test, kendi küçük dünyasını kuruyordu:

| Test | Neyi render ediyor? | Sonuç |
| --- | --- | --- |
| `LoginPage.test.tsx` | `createMemoryRouter([{ path: '/login', element: <LoginPage /> }])` — kendi mini router’ı | ✅ Form doğru |
| `ProtectedRoute.test.tsx` | `<ProtectedRoute isAuthenticated={false} />` — kapı tek başına | ✅ `/login`’e yönlendiriyor |
| `WatchlistForm.test.tsx` | Formu, giriş yapılmış bir store ile | ✅ Liste ekleniyor |

Üç parça da **tek başına** doğru. Bozuk olan, parçaların birleştiği yer: gerçek `routes` dizisi. Onu, gerçek `main.tsx`’teki provider’larla ve gerçek tarayıcıyla birlikte, “kullanıcının yürüdüğü yol” boyunca çalıştıran tek bir test yoktu.

## Üç katman, üç soru

| Katman | Araç | Neyi çalıştırır? | Hız | Cevapladığı soru |
| --- | --- | --- | --- | --- |
| Birim | Vitest | Tek fonksiyon (`formatVote`, `refreshSession`) | ms | “Bu fonksiyon doğru mu hesaplıyor?” |
| Entegrasyon | Vitest + RTL + MSW (jsdom) | Bir sayfa/bileşen, sahte ağla | 10–100 ms | “Bu sayfa kullanıcıya doğru şeyi gösteriyor mu?” |
| Uçtan uca (E2E) | Playwright | **Tüm uygulama**, gerçek tarayıcıda, gerçek sunucudan | saniyeler | “Kullanıcı bu yolu baştan sona yürüyebiliyor mu?” |

E2E testi uygulamayı dışarıdan görür: `pnpm dev` ile sunulan Sinema’yı Chromium’da açar, kullanıcı gibi tıklar ve yazar. Bu yüzden ancak o katmanın gördüğü hataları yakalar:

- `main.tsx`’teki provider sırası, gerçek `createBrowserRouter`, `lazy` route’ların indirilmesi,
- gerçek CSS: görünmeyen ya da üstü bir overlay ile kapanmış buton,
- gerçek tarayıcı davranışı: yenileme, geri tuşu, `localStorage`,
- açılışta çöken config: Modül 15’teki Zod’lu `env.ts` token bulamayınca beyaz ekran.

:::info[Dürüst olalım]
Bu örnekteki hatayı, gerçek `routes` dizisini `createMemoryRouter(routes)` ile render edip girişten listeye kadar yürüyen bir **entegrasyon** testi de yakalardı. Sorun araç değil, **eksik senaryoydu**: kimse akışın tamamını test etmemişti. E2E’nin farkı, o senaryoyu uygulamanın gerçekten çalıştığı ortamda, uygulamanın **kendi kodundan** hiçbir parçayı taklit etmeden koşması. (Yalnızca dışarıdaki API’leri taklit edeceğiz; 5. derste.)
:::

## Az ama kritik

E2E testi pahalıdır: saniyeler sürer, bir tarayıcı ve sunucu ister, kaldığında sebebi bir birim testi kadar net değildir. Bu yüzden her davranışı E2E ile test etmeyiz. Sinema için iki **kritik yolculuk** seçiyoruz:

1. **Ana sayfa → arama → detay**: uygulamanın var oluş sebebi.
2. **Giriş → izleme listesi**: bu modülün acısı.

Geri kalanı (puan biçimi, boş tarih, tek tek hata mesajları) hızlı birim ve entegrasyon testlerinde kalır. Buna “test kupası” (testing trophy) denir: tabanda statik kontroller (TypeScript, ESLint), üstünde birim testleri, en geniş gövdede entegrasyon testleri, tepede **az sayıda** E2E testi.

## Bir E2E testi neye benzer?

Önümüzdeki derslerde parça parça kuracağımız testin son hali:

```ts check title="e2e/auth-watchlist.spec.ts"
import { expect, test } from '@playwright/test'

test('giriş yapan kullanıcı izleme listesi oluşturur', async ({ page }) => {
  await page.goto('/watchlists')
  await expect(page).toHaveURL('/login')

  await page.getByLabel('Kullanıcı adı').fill('emilys')
  await page.getByLabel('Parola').fill('emilyspass')
  await page.getByRole('button', { name: 'Giriş yap' }).click()
  await expect(page).toHaveURL('/watchlists')

  await page.getByLabel('Liste adı').fill('Hafta sonu')
  await page.getByRole('button', { name: 'Kaydet' }).click()
  await expect(page.getByRole('listitem').filter({ hasText: 'Hafta sonu' })).toBeVisible()
})
```

`getByRole`, `getByLabel`… Modül 11’deki RTL sorgularının neredeyse aynısı. Fark şu: bu satırlar jsdom’da değil, gerçek Chromium’da, gerçek `main.tsx`’ten açılan uygulamada çalışıyor. Cuma günkü commit’te bu test `getByLabel('Kullanıcı adı')` satırında kalırdı: form hiç yoktu.

:::mistake[Sık hata]
“E2E en gerçekçisi, hepsini E2E yazalım.” 300 E2E testi 20 dakika sürer, her kalışta “sunucu mu, ağ mı, kod mu?” diye aranırsın ve ekip testleri çalıştırmayı bırakır. E2E’yi kritik yolculuklara sakla; ayrıntıyı hızlı katmanlarda test et.
:::

:::sector[Sektörde]
Tarayıcı otomasyonunda bugün en yaygın araç **Playwright** (Microsoft). Cypress hâlâ yaygın; Selenium eski projelerde karşına çıkar. Playwright tek API ile Chromium, Firefox ve WebKit’i sürer, beklemeleri kendisi yönetir ve kalan testin adım adım kaydını (trace) çıkarır. Bu modül Playwright 1.63 ile yazıldı.
:::
