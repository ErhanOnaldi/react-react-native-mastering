---
title: "Query testleri"
minutes: 8
kind: concept
---

# Query testleri

:::pain[Problem]
Bir testte aranan film diğer testte cache’den geliyor; testler tek başına geçip birlikte kalıyor. Paylaşılan `QueryClient` testleri birbirine bağlıyor.
:::

## Her test yeni istemci

`new QueryClient({ defaultOptions: { queries: { retry: false } } })` oluştur, bileşeni `QueryClientProvider` ile sar. `retry: false` hata testinde beklemeyi ve tekrar GET’leri önler. MSW gerçek TMDB taklidi sunar; `requests()` ise ağ davranışını sayar.

```tsx check title="src/test/render-query.tsx"
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { render } from '@testing-library/react'
import type { ReactElement } from 'react'

export function renderQuery(ui: ReactElement) {
  const client = new QueryClient({ defaultOptions: { queries: { retry: false } } })
  return { client, ...render(<QueryClientProvider client={client}>{ui}</QueryClientProvider>) }
}
```

Aynı test içinde "arama → detay → geri" akışını kur; 1 ve 2 istek farkını izle. Farklı testler arasında ise cache paylaşma. Hata için `server.use` ile 500 dön, ekrandaki mesajı doğrula.

:::mistake
`waitFor` içinde tıklama veya istek başlatma. `waitFor` yalnız beklentiyi tekrar dener; kullanıcı eylemini önce yap.
:::
