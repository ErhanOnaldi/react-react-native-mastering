## Neden böyle?

`NavLink` geçerli route'u bilir ve etkin bağlantıya `aria-current="page"` ekler. Kök bağlantısındaki `end`, alt sayfalarda yanlış etkinlik göstermesini önler. Ek bir `useState` ile adresi kopyalamak senkronizasyon hatası doğurur. Sonraki derste menüyü ortak layout'a taşıyacağız.

:::sector
Sektörde etkin sayfanın ekran okuyuculara bildirilmesi menü kalitesinin bir parçasıdır.
:::
