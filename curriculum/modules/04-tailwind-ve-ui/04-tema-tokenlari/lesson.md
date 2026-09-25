---
title: Ortak tema token’ları
minutes: 8
kind: concept
---

# Ortak tema token’ları

:::pain[Problem]
Buton `sky-700`, badge `blue-700`, arama alanı `indigo-700` kullanıyor. Ürün rengini değiştirirken hangi tonu nerede kullandığını bulamıyorsun.
:::

## Karara ad ver

Tailwind v4 `@theme` içindeki `--color-brand-*` değişkeninden `bg-brand-*`, `text-brand-*` utility'lerini üretir. İsim rengin görevini anlatır; tasarım değişince kullanım yerleri aynı kalır.

```css title="src/index.css"
@import "tailwindcss";
@custom-variant dark (&:where(.dark, .dark *));
@theme {
  --color-brand-600: #0369a1;
  --color-brand-700: #075985;
  --font-display: ui-sans-serif, system-ui, sans-serif;
}
```

```tsx check
export function BrandTitle() {
  return <h1 className="font-display text-3xl font-bold text-brand-700 dark:text-brand-600">Sinema</h1>
}
```

`@theme` utility üretir; sıradan CSS değişkeni sadece değer taşır. Tek özel CSS kuralı gerekiyorsa CSS yazabilirsin. V4'te tekrar kullanılabilir kendi utility'n gerekirse `@utility` tanımlarsın; eski JS config ve `@layer utilities` kalıbı burada kullanılmaz.

Dark modda `.dark` kapsamında değişken değeri verebilir veya açıkça `dark:bg-*` yazabilirsin. Bir görünümde hangi yaklaşımın geçerli olduğunu belirgin tut.

:::mistake[Sık hata]
`bg-brand-700` bir hex kod değildir; `@theme` içindeki `--color-brand-700` adından üretilir.
:::
