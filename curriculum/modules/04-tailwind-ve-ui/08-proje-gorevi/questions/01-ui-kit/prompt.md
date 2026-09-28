Sinema'da aynı görünüm kararları kopyalandı. Ortak bir UI kit kurarak sayfaların erişilebilir ve tutarlı HTML parçalarını paylaşmasını sağla.

## Gereksinimler
- `src/lib/cn.ts` içindeki `cn` koşullu class'ları birleştirsin; `cn('p-2', 'p-4')` sonucu `p-4` olsun.
- Button primary/secondary/ghost ve sm/md/lg seçeneklerini, primary/md varsayılanlarıyla sunsun. Native button props'ları aktarılsın, dış class override edebilsin, klavye odağı ve disabled görünümü tanımlansın.
- Badge (`span`), Card (`article`), Skeleton (`div`) ve Input (`input`) kendi dosyalarından export edilsin. Native props ve `className` iletilsin; uygun bileşenler children göstersin. Çakışan utility'lerde dış class temel class'ı override etsin.
- Skeleton `aria-hidden="true"` ve pulse görünümü taşısın.
- `src/index.css` `@import "tailwindcss";`, `@theme` içinde `--color-brand-*` ve `--font-*` token'larını, `@custom-variant dark (&:where(.dark, .dark *));` tanımını içersin.

## Örnek
Bir Button disabled ve `aria-label` taşıdığında native davranışını korur. Bir Card içinde Badge gösterilir; Card'a `p-8` verilince temel padding değişir.

## Sözleşme
- `src/lib/cn.ts` → `cn(...inputs): string`.
- `src/components/ui/button.tsx` → `Button`, `buttonVariants`.
- `src/components/ui/badge.tsx` → `Badge`; `card.tsx` → `Card`; `skeleton.tsx` → `Skeleton`; `input.tsx` → `Input`.
- `src/index.css` tema ve Tailwind giriş dosyasıdır.
- Önizleme için üç Button görünümünü/boyutını ve diğer primitive'leri gösteren basit bir alan ekleyebilirsin.
