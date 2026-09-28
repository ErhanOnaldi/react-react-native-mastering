Sinema ekranlarında farklı görünüme ve boyuta sahip, native button davranışını koruyan tekrar kullanılabilir bir düğme oluştur.

## Gereksinimler
- Görünüm seçenekleri `primary`, `secondary`, `ghost`; boyut seçenekleri `sm`, `md`, `lg` olsun.
- Varsayılan görünüm `primary`, varsayılan boyut `md` olsun.
- Ortak class'lar `inline-flex items-center rounded-lg`, `focus-visible:outline-2`, `disabled:opacity-50` olsun.
- `primary` arka planı `bg-sky-700`, `secondary` sınırı `border-sky-700`, `ghost` arka planı `bg-transparent` olsun.
- Boyutlar sırasıyla `sm: px-2`, `md: px-4`, `lg: px-6` kullansın.
- `ghost` + `sm` birleşiminde `underline-offset-2` olsun.
- `type`, `disabled`, `aria-*`, `data-*` ve `onClick` native button'a aktarılsın.
- Çağıranın class'ı temel class'lardaki çatışmayı override edebilsin.

## Örnek
Props verilmediğinde primary/md görünümü oluşur. `variant="ghost" size="sm"` ayrı birleşim üretir; `className="px-8"` temel yatay padding'i override eder.

## Sözleşme
- Dosya ve export: `Button.tsx` → `Button` bileşeni ve `buttonVariants({ variant?, size? })` class üreticisi.
- Önizleme dokuz görünüm/boyut birleşimini gösterir.
