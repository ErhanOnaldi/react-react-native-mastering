---
title: Ortak tema token’ları
minutes: 8
kind: concept
---

# Ortak tema token’ları

:::pain[Problem]
Buton `sky-700`, badge `blue-700`, arama alanı `indigo-700` kullanıyor. Ürün rengini değiştirirken hangi tonu nerede kullandığını bulamıyorsun.
:::

## Değeri anlamıyla adlandır

Tek tek renk kodları bir tasarımın görevlerini açıklamaz. Design token, örneğin marka rengi veya yüzey rengi gibi ortak karara anlamlı bir ad verir. Tailwind v4 `@theme` değişkenlerinden utility adları üretebilir; normal CSS değişkeni ise değeri taşır. Token sayesinde aynı karar birkaç bileşende tutarlı kalır ve tema değişimi tek yerden yönetilir.

Sinema'da farklı mavi tonlarının kazara çoğalması, görsel tekrarın veri tekrarı gibi bakım maliyeti taşıdığını gösterir. Önceki utility dersleri tek öğeyi biçimlendirdi; bu ders öğeler arasında paylaşılan tasarım dilini kurar.

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

## Token ne zaman gerekli?

Tek bir kartın kenar boşluğu için `p-4` yeterli. Aynı marka rengini Button, Badge ve başlık paylaşınca `brand` token'ı anlam kazanır. `--color-brand-700` değerini tek yerde değiştirip bütün kullanım yerlerini güncelleyebilirsin. `--font-display` da `font-display` class'ına dönüşür; font ailesinin ayrıntısı bileşene sızmaz.

Gerçekten yeni bir yardımcı class gerekirse v4 CSS'te tanımlarsın:

```css title="src/index.css"
@utility poster-frame {
  aspect-ratio: 2 / 3;
  object-fit: cover;
}
```

Bu örnek ancak poster alanının aynı iki kararı birçok yerde tekrarlandığında yararlıdır. Tema token'ı değeri adlandırır, utility ise bir veya birkaç CSS bildirimini adlandırır. İkisini her küçük CSS satırı için oluşturmak yerine ihtiyaca göre seç.

:::mistake[Sık hata]
`bg-brand-700` bir hex kod değildir; `@theme` içindeki `--color-brand-700` adından üretilir.
:::
