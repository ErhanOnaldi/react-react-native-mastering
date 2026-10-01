Film kartındaki Detay eylemi bazen düğme, bazen bağlantı olmalı. Her kullanımda aynı görsel dili koru ve bağlantının içinde fazladan bir düğme üretme.

## Gereksinimler
- Varsayılan durumda erişilebilir adı çocuk metni olan gerçek `button` üret.
- Button props'ları (`type`, `disabled`, `onClick`) çalışmaya devam etsin.
- `asChild` ile verilen tek `<a>` çocuk DOM'da tek link olarak kalsın; iç içe button oluşmasın.
- `primary` görünümünde `bg-primary text-primary-foreground`, `outline` görünümünde `border border-input` sınıfları bulunsun.
- Dışarıdan gelen `className` varsayılan sınıflarla birleştirilsin.

## Örnek
`<MovieAction asChild><a href="/movie/550">Dövüş Kulübü</a></MovieAction>` DOM'da bir `Dövüş Kulübü` adlı link gösterir.

## Sözleşme
- `MovieAction.tsx` → `MovieAction` named export'u.
- Bileşen `children`, `asChild`, `variant` (`primary` veya `outline`), `className` ve standart button props'larını kabul eder.
- Varsayılan `variant`: `primary`.
