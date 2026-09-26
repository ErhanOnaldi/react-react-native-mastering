Sinema film kartındaki “Detay” eylemi bazen sayfa linki, bazen form düğmesi. Her yerde ikinci bir `<button>` üretirsen linkin içinde button olur ve klavye davranışı bozulur.

## Görev

`MovieAction.tsx` içindeki named export `MovieAction` bileşenini tamamla.

- Varsayılan durumda gerçek `<button>` render etsin; `type`, `disabled`, `onClick` gibi button props'larını korusun.
- `asChild` olduğunda `Slot.Root` kullansın. Tek çocuk `<a>` ise DOM'da **yalnız link** kalsın.
- `variant="primary"` için `bg-primary text-primary-foreground`, `variant="outline"` için `border border-input` sınıflarını `cva` ile seçsin.
- Dışarıdan gelen `className` değerini `cn` ile birleştirsin.

Örnek: `<MovieAction asChild><a href="/movie/550">Dövüş Kulübü</a></MovieAction>` tek bir link üretir.
