Sinema kartı açık ve koyu temada farklı zemin istiyor. Her karta hex renk yazmak yerine rol adı kullan.

## Görev

`ThemeCard` named export'unu tamamla:

- Semantik `<article>` render etsin; başlığı `<h2>` içinde göstersin.
- Yüzeye `bg-card`, metne `text-card-foreground` uygulasın. Köşeleri `rounded-lg` olsun.
- Gelen `className` değerini `clsx` + `tailwind-merge` ile birleştirsin; çakışan utility'lerde dışarıdan gelen değer son sözü söylesin.

Örnek: `<ThemeCard title="Dövüş Kulübü" className="rounded-none" />` keskin köşeli kart üretir.
