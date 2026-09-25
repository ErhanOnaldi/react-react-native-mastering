---
title: "Bileşenin sözleşmesini tasarla"
minutes: 8
kind: concept
---

# Bileşenin sözleşmesini tasarla

:::pain[Problem]
Bir MovieShelf için `showTitle`, `showCount`, `titleColor`, `emptyText`, `showFooter` derken prop listesi büyüdü. Bir sayfanın istediği özel alt bilgi için yine bileşenin içine koşul ekliyorsun.
:::

## İhtiyaçtan karar

Tek bir kararlı seçenek için açık bir config prop kullan. Serbest içerik için `children`/composition seç. Bileşen state’inin sahibi dışarıdaysa controlled (`value`, `onChange`), içerideyse uncontrolled (`defaultValue`) olur.

## Sinema’da dene

SearchBox URL state’i ile eşleşiyorsa controlled olmalı. Sadece yerel aç/kapa tercihi taşıyan film paneli uncontrolled olabilir; gerektiğinde controlled kullanım da desteklenebilir.

## Kullanım yerinden bak

```tsx
<MovieShelf title="Trendler" defaultOpen>
  <MovieGrid movies={movies} />
</MovieShelf>
```

Rafın başlığı kararlı bir metin olduğu için `title` prop’u uygundur. İçerik film listesi, açıklama veya bir bağlantı olabilir; bunu beş ayrı `showX` prop’una çevirmek yerine `children` ile ver. Arama kutusunda ise `value` ile `onChange` birlikte kullanılmalı: URL değişince kutu da güncellenir. `defaultValue`, yalnız ilk değeri verir; sonradan gelen URL değişimini tek başına izlemez.

Rafın açık durumu sadece kendi içinde gerekliyse `defaultOpen` ile başlayabilir. Favoriler sayfası açık durumu dışarıdan yönetmek istediğinde `open` ve `onOpenChange` gerekir. Controlled durumda tıklama callback çağırır; görünüm yeni `open` prop’u gelene kadar değişmez. Bu küçük ayrım iki farklı state sahibini aynı anda yaratmayı önler.

:::mistake[Sık hata]
`value` ile `defaultValue` aynı anda gelirse iki sahip oluşur. Controlled modda iç state’i sessizce değiştirme; değişim isteğini callback ile sahibine bildir.
:::

:::sector[Sektörde]
İyi API az prop demek değildir. Kullanım yerinde anlamlı, tutarlı adlar ve açık state sahipliği demektir.
:::
