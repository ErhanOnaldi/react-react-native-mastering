Referans kurulum: `curriculum/checkpoints/kitaplik/22` (son hali; bu derste yalnız iskeleti kurmuştun).

## Neden böyle?

- **İki config, tek kaynak.** `vitest.config.ts`, `mergeConfig(viteConfig, …)` ile uygulamanın eklentilerini ve takma adını devralır. Testler tarayıcıdakiyle aynı çözümlemeyi kullanır; ama test ayarları uygulama config’ini kirletmez. Vitest’in dokümanı da iki yolu (tek dosya ya da ayrı dosya) destekler; ayrı dosya, uygulamayı başka araçların (platform, Storybook…) da okuduğu projelerde daha güvenlidir.
- **`createRoutes(queryClient)` bir fabrika.** Route ağacı modül yüklenirken değil, çağrılınca kurulur. Bu tek karar sayesinde testler her seferinde taze bir `QueryClient` ve bellekte bir router (`createMemoryRouter`) kullanır; loader’lar da aynı istemciyi paylaşır. TanStack Router’daki `context: { queryClient }` fikrinin React Router’daki sade karşılığıdır.
- **`AppProviders` tek yerde.** `main.tsx` ile `renderApp` aynı provider ağacını kullanır. 5. derste okuma listesi provider’ı eklendiğinde testleri değiştirmen gerekmez.
- **Kurallar yerli yerinde.** React hook kuralları yalnız `src`’ye; `globals.node` config dosyaları için. `eslint-config-prettier` en sonda olmazsa, sonra gelen bir preset biçim kuralını yeniden açabilir.
- **`reuseExistingServer: !process.env.CI`.** Yerelde açık `pnpm dev`’i kullanır (hızlı), CI’da her seferinde temiz sunucu açar (güvenilir).

## Sık tuzaklar

| Belirti | Sebep |
| --- | --- |
| `pnpm test` bir `.spec.ts`’te “did not expect test() to be called here” | `e2e/` Vitest’ten hariç tutulmamış |
| Editörde `@/…` kırmızı ama uygulama çalışıyor | Takma ad sadece Vite’ta; tsconfig `paths` eksik |
| `Invalid hook call` / “No QueryClient set” | Projede kökten farklı bir React/Query sürümü: iki kopya |
| ESLint `process is not defined` (playwright.config.ts) | Config dosyalarına `globals.node` verilmemiş |
| Playwright “Timed out waiting for webServer” | `webServer.url`/port ile `command`’ın portu farklı |

Bir sonraki adımda ilk gerçek özelliği yazacaksın: arama.
