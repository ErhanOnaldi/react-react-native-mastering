---
title: "Sinema test altyapısı ve sayfalar"
minutes: 8
kind: project
---

# Sinema test altyapısı ve sayfalar

:::pain[Problem]
Sinema format fonksiyonları testli, ama kullanıcı arayıp filme tıkladığında ne olacağını doğrulayan test yok. Elle fetch mock’ları istek sırası değişince kırılıyor.
:::

## İhtiyaç ve çözüm

Önce `src/test/setup.ts`, `src/test/msw/handlers.ts` ve `src/test/render.tsx` ile altyapı kur. Sonra SearchPage ve MovieDetailsPage için kullanıcı akışı testleri yaz.

SearchPage testinde query ve debounce’u, sonuç ve boş listeyi gör. MovieDetailsPage testinde `/movie/550` için Dövüş Kulübü’nü, 404 için hata görünümünü sına. Sonraki modülde TanStack Query gelince aynı davranış sözleşmesi kalır.

## İki aşamalı uygulama

İlk görevde ortak test ortamını kurarsın. `setup.ts` bir kez MSW sunucusunu açar, her testten sonra handler ve DOM kalıntısını temizler. `handlers.ts`, gerçek TMDB sözleşmesindeki Bearer başlığını ve cevap biçimini taklit eder. `render.tsx`, `createMemoryRouter` ile URL’yi test girdisine çevirir. Bu altyapı, sayfa testinin her birinde tekrar yazılmamalı.

İkinci görevde iki sayfayı ayrı davranışlarla korursun. SearchPage’de kullanıcı input’a yazar ve debounce sonrası `?q=` ile API isteği değişir; boş liste ve 500 senaryoları görünür metne dönüşür. MovieDetailsPage’de route id 550 olduğunda Dövüş Kulübü görünür, bilinmeyen id’de 404 kullanıcıya anlaşılır hata gösterir. Her iki testte de DOM sonucunu ve ilgili ağ sınırını ayrı ayrı doğrula.

```tsx title="src/pages/MovieDetailsPage.test.tsx"
renderWithRouter(routes, { route: '/movie/550' })
expect(await screen.findByRole('heading', { name: /Dövüş Kulübü/ })).toBeInTheDocument()
```

Buradaki `routes`, projenin route tanımından gelir. Testi sırf mevcut bileşen yapısına uydurmak için sayfayı yeniden yazma; kullanıcının gördüğü sözleşmeyi koru. 12. modülde fetch yönetimi TanStack Query’ye taşınırken aynı davranış testleri refactor güvenliği sağlayacak.

:::mistake
`vi.mock('fetch')` ile yalnız çağrı sayısını ölçmek bu görevin amacı değildir. MSW handler’ı gerçek HTTP isteğini yakalarken testte `getByRole` ve `findByRole` ile sonucu da izle.
:::

:::sector[Sektörde]
Bu testler Query refactor’unda uygulama içi fetch kodu değişse de arama ve detay sayfalarının kullanıcı sözleşmesini korur.
:::
