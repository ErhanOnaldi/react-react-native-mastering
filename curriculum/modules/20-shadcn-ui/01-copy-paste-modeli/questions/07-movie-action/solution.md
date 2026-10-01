## Neden böyle?
`asChild` olduğunda `Slot.Root` kendi DOM öğesini render etmez; aldığı props'u (`className`, `onClick`, `ref`…) **tek çocuğun** üzerine birleştirir. Böylece linkin içine ikinci bir `<button>` girmez: DOM'da yalnız `<a>` kalır, rolü `link`, klavye davranışı (Enter ile gezinme) doğaldır.

`cva` variant kurallarını tek bir yerde toplar; `cn` (clsx + tailwind-merge) dışarıdan gelen `className`'i ekler ve çakışan utility'lerde sonuncuyu bırakır.

### 19. modüldeki SlotTrigger ile fark
Orada `cloneElement` ile handler, `className` ve ref birleştirmeyi kendin yazdın. `Slot.Root` aynı işi yapar: çocuğun handler'ı önce, Slot'unki sonra çalışır; `className`'ler birleşir; ref'ler birleştirilir. Artık bu ayrıntıyı test edilmiş bir primitive taşıyor.

### Sık hata
`asChild` ile birden fazla çocuk vermek: Slot tek element bekler. `<MovieAction asChild>İzle <Icon /></MovieAction>` çalışmaz; çocukları bir `<a>` içine sar.

### Sektörde
shadcn'in `button.tsx` dosyası tam olarak bu kalıbı kullanır: `const Comp = asChild ? Slot.Root : "button"`. Sinema projesinde bu dosya senin olacak.
