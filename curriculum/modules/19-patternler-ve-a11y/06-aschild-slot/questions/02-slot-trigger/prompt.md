Mevcut film kartı button'unu `Modal.Trigger` içine koyunca iki button oluşuyor. `SlotTrigger asChild` ile yalnızca tek DOM öğesi üret ve prop/ref kaybını önle.

## Gereksinimler
- `SlotTrigger({ asChild, onOpen, children, ref, className })` yaz. `asChild` verilmezse kendi `<button type="button">` öğesini render etsin.
- `asChild` verildiğinde **tek** React element child'ı klonlasın. Child click handler'ı önce çalışsın; event `preventDefault()` ile durdurulmadıysa `onOpen` sonra çalışsın.
- Child ve Trigger `className` değerleri birleşsin. Trigger'ın `aria-label` prop'u child'da görünsün; child `aria-label` verdiyse onu koru.
- Child ref ile Trigger ref aynı DOM öğesini görsün. React 19 `ref` prop'unu kullan.

Önizlemede Tab ile tek düğmeye gel ve Enter'a bas. Testte iki ref'in de aynı button'u işaret ettiğini göreceksin.
