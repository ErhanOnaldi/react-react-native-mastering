## Bağlam

Sinema’ya Playwright’ı ekliyoruz. Config tek başına bir test değil ama bütün testlerin **nereye** bağlanacağını belirliyor: yanlış port, eksik token ya da CI’da eski bir sunucuyu yeniden kullanmak, her testi aynı anda kırar.

Config’i bir fonksiyon olarak yazıyoruz ki CI ve yerel davranışı test edebilelim. Gerçek dosya bu fonksiyonu tek satırla kullanır:

```ts title="playwright.config.ts"
import { createSinemaConfig } from './sinema-config'

export default createSinemaConfig({ ci: !!process.env.CI })
```

## Görev

`createSinemaConfig({ ci })` şu ayarları döndürsün (`defineConfig` ile):

| Ayar | Değer |
| --- | --- |
| `testDir` | `'./e2e'` |
| `use.baseURL` | `'http://localhost:5174'` (Sinema’nın `vite.config.ts` portu) |
| `projects` | `name: 'chromium'`, `use: { ...devices['Desktop Chrome'] }` |
| `webServer.command` | `'pnpm dev'` |
| `webServer.url` | `baseURL` ile **aynı** adres |
| `webServer.reuseExistingServer` | Yerelde `true`, CI’da `false` |
| `webServer.env` | `{ VITE_TMDB_TOKEN: 'e2e-sahte-token' }` (boş olmayan herhangi bir sahte değer) |

## Örnek

```ts
createSinemaConfig({ ci: false }).webServer // { …, reuseExistingServer: true }
createSinemaConfig({ ci: true }).webServer  // { …, reuseExistingServer: false }
```

`webServer`’ı tek bir nesne olarak ver (Playwright birden çok sunucu için dizi de kabul eder; Sinema’da tek sunucu var).
