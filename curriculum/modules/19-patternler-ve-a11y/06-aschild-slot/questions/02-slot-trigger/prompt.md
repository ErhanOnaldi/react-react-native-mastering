Mevcut kart button'unu bir modal tetikleyicisinin içine koyunca iç içe iki button oluşuyor. Tetikleyici davranışını tek DOM öğesinde sun ve child'ın click, erişilebilir ad, class ve ref bilgilerini koru.

## Gereksinimler

- `asChild` verilmezse tek `<button type="button">` render et; click `onOpen` çağırsın.
- `asChild` verilince tam bir React elementini kullan; ek button üretme.
- Child click handler'ı önce çalışsın. Event `preventDefault()` ile durdurulmadıysa `onOpen` sonra çalışsın.
- Child ve Trigger class değerleri birlikte bulunsun.
- Trigger'ın `aria-label` değeri child'da yoksa aktarılsın; child kendi adını verdiyse korunsun.
- Child ref ve Trigger ref aynı DOM öğesini göstersin.

## Örnek

Child `preventDefault()` çağırmadığında handler sırası `child` → `open`; çağırdığında yalnızca `child` çalışır. `className="movie"` ile `className="trigger"` aynı button'da kalır.

## Sözleşme

- `SlotTrigger.tsx` içinden named export `SlotTrigger({ asChild, onOpen, children, ref, className })`.
- `onOpen: () => void`; `children` tek element olabilir; `asChild` boolean.
- Düğme tabanlı örnekte erişilebilir rol `button` olarak kalır.
