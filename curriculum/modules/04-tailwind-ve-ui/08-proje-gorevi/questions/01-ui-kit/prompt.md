Sinema'da aynı class kararları kopyalandı. Ortak UI kit'i gerçek projeye kur:

1. `src/lib/cn.ts` içinden `cn(...inputs)` export et; `clsx` ile koşulları birleştir, `tailwind-merge` ile Tailwind çatışmalarını çöz. `cn('p-2', 'p-4')` sonucu `p-4` olmalı.
2. `src/components/ui/button.tsx` içinden `Button` ve `buttonVariants` export et. `variant`: `primary | secondary | ghost`; `size`: `sm | md | lg`; varsayılan primary/md. cva ve `VariantProps` kullan. Gerçek `<button>` props'ları (`disabled`, `type`, `aria-*`, `data-*`, `onClick`) iletilsin. `className` son override olsun. Klavye odağı ve disabled görünümü de tanımla.
3. Ayrı dosyalardan `src/components/ui/badge.tsx` → `Badge` (`span`), `card.tsx` → `Card` (`article`), `skeleton.tsx` → `Skeleton` (`div`), `input.tsx` → `Input` (`input`) export et. `children` uygun olanlarda gösterilsin; doğal HTML props'ları ve `className` iletilsin. Skeleton `aria-hidden="true"` ve görsel pulse class'ı taşısın.
4. `src/index.css` içinde Tailwind v4 `@import "tailwindcss";`, `@theme` içinde en az bir `--color-brand-*` ve bir `--font-*` token'ı, `.dark` üst öğesi için `@custom-variant dark (&:where(.dark, .dark *));` tanımla. Eski JS config ve v3 direktiflerini kullanma.

Kit'i `App` dışında basit bir yerde önizleyebilirsin: üç Button varyantını, üç boyutu, bir Card içinde Badge'i ve Skeleton'ı yan yana gör. Renkleri kendi tasarımına göre seçebilirsin; testler renk pikselini değil varyantların ayrı class üretmesini ve davranış sözleşmesini kontrol eder.
