Sinema ekranlarında farklı görünüme ve boyuta sahip, native button davranışını koruyan tekrar kullanılabilir bir düğme oluştur.

## Gereksinimler
- Görünüm seçenekleri `primary`, `secondary`, `ghost`; boyut seçenekleri `sm`, `md`, `lg` olsun.
- Varsayılan görünüm `primary`, varsayılan boyut `md` olsun.
- Ortak class'lar `inline-flex items-center rounded-lg font-semibold`, `focus-visible:outline-2`, `disabled:opacity-50` olsun.
- `primary`: `bg-sky-700 text-white`; `secondary`: `border border-sky-700 text-sky-700`; `ghost`: `bg-transparent text-sky-700` olsun.
- Boyut class'ları `sm: px-2 py-1 text-sm`, `md: px-4 py-2`, `lg: px-6 py-3 text-lg` olsun.
- `ghost` + `sm` birleşiminde `underline-offset-2` olsun.
- `type`, `disabled`, `aria-*`, `data-*` ve `onClick` native button'a aktarılsın.
- Çağıranın class'ı temel class'lardaki çatışmayı override edebilsin.

## Örnek
Props verilmediğinde primary/md görünümü oluşur. `variant="ghost" size="sm"` ayrı birleşim üretir; `className="px-8"` temel yatay padding'i override eder.

## Sözleşme
- Dosya ve export: `Button.tsx` → `Button` bileşeni ve `buttonVariants({ variant?, size? })` class üreticisi.
- Önizleme dokuz görünüm/boyut birleşimini gösterir.
