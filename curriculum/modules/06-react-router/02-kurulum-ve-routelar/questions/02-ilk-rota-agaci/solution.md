## Neden böyle?

React state değişimi tarayıcı geçmişine yazılmaz; `Link` ile açılan route yazılır. RouteObject dizisi testte MemoryRouter ile yeniden kullanılabilir. `<a href>` tam sayfa yüklemesi yapar; uygulama içi gezinmede Link tercih edilir. Sonraki adım aktif menüyü göstermek.

:::sector
Sektörde rota tanımlarını ayrı export etmek, aynı ağacı testte ve uygulamada kullanmayı kolaylaştırır.
:::
