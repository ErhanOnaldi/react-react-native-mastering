---
title: "Rota hatası ve 404"
minutes: 8
kind: concept
---

# Rota hatası ve 404

:::pain[Problem]
Kullanıcı `/olmayan` adresine gidince ne olduğunu anlamıyor; eşleşen bir sayfanın loader’ı hata verdiğinde de boş ekran görüyor. Bu iki durum için anlaşılır ekranlar gerekiyor.
:::

## İki farklı başarısızlık

`*` route eşleşmeyen adresleri `NotFoundPage`'e götürür. Eşleşen bir route'un loader/render hatası için `errorElement` ayrı bir hata yüzeyi sağlar. `useRouteError()` değeri bilinmez (`unknown`); `isRouteErrorResponse` ile Router'ın durum cevabını daralt. Başka hatalarda genel, güvenli bir mesaj göster.

```tsx title="src/pages/RouteError.tsx"
import { isRouteErrorResponse, useRouteError } from 'react-router'

export function RouteError() {
  const error = useRouteError()
  return <main role="alert">{isRouteErrorResponse(error) && error.status === 404
    ? 'Sayfa bulunamadı' : 'Bir şeyler ters gitti'}</main>
}
```

Root route'a `errorElement: <RouteError />`, `children` içine `{ path: '*', element: <NotFoundPage /> }` koy. `/movie/999999` rota olarak eşleşir; film verisinde bulunamama durumunu detay sayfası ayrıca ele alır.

:::mistake[Sık hata]
`errorElement` tek başına her bilinmeyen URL'yi kullanıcıya uygun bir 404 sayfasına dönüştürmez. Yakalama rotasını açıkça tanımla.
:::

:::sector
Hata sayfasında kullanıcıya geri dönebileceği bağlantı ver; teknik stack trace'i son kullanıcıya basma.
:::
