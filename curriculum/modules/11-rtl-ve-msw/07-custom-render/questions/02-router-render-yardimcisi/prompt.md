## Sorun
Her MovieDetailsPage testinde memory router kurmak 15 satır tekrara yol açıyor.

## Görev
`renderWithRouter(ui, { path, route })` export et. `ui: ReactNode`, `path: string`, `route: string`. `createMemoryRouter([{ path, element: ui }], { initialEntries: [route] })` kur, `RouterProvider` ile render et ve `{ router, ...renderResult }` döndür. `RouterProvider` import’u `react-router/dom` adresinden gelsin.

## Örnek
`renderWithRouter(<MovieId />, { path: '/movie/:id', route: '/movie/550' })` → ekranda `550`.
