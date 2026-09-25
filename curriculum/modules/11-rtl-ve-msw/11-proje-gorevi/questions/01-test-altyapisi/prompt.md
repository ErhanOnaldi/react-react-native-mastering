## Sorun
Sinema testleri her defasında fetch’i elle değiştiriyor. Arama ve detay testi aynı 20 satırlık hazırlığı kopyalıyor.

## Görev
Projede tam bu yolları oluştur:

| Yol | Sözleşme |
| --- | --- |
| `src/test/msw/handlers.ts` | `handlers` adlı MSW 2 handler dizisini export et. `/search/movie` ve `/movie/:id` için en az birer `http.get`; Bearer yetkisini kontrol et. 550 için Dövüş Kulübü, 404 için TMDB biçimli hata döndür. |
| `src/test/setup.ts` | `@testing-library/jest-dom/vitest` import et. `setupServer(...handlers)` kur; `beforeAll` listen (`onUnhandledRequest: 'error'`), `afterEach` cleanup ve resetHandlers, `afterAll` close. `server` export et. |
| `src/test/render.tsx` | `renderWithRouter(ui | routes, { route })` export et. `ui` JSX/ReactNode ya da `RouteObject[]` kabul et. Dizi verilirse onu route tablosu olarak kullan; tek UI verilirse `{ path: "*", element: ui }` route’unu oluştur. Parametreli sayfa testlerinde `RouteObject[]` ver. `createMemoryRouter` + `RouterProvider` (`react-router/dom`) ile render et ve router’ı döndür. |

`vite.config.ts` test ayarına `setupFiles: ['./src/test/setup.ts']` ekle. Projede jest-dom, MSW ve RTL bağımlılıklarını kök catalog sürümleriyle kullan. Mevcut Router ve Vite ayarlarını koru.

## Örnek
`renderWithRouter([{ path: '/movie/:id', element: <MovieId /> }], { route: '/movie/550' })` → id 550.

Sinema’da `pnpm test` çalıştır. Elindeki biçim testleri de geçmeye devam etmeli.
