---
title: "Tema: aynı rol, iki görünüm"
minutes: 8
kind: concept
---

# Tema: aynı rol, iki görünüm

:::pain[Problem]
Sinema'nın koyu modunda “İzle” düğmesi okunuyor, ama açık modda eski sabit `bg-zinc-900 text-white` sınıfı her kartta fazla ağır duruyor. Onlarca kopya sınıfı tek tek değiştirmek istemiyorsun.
:::

## Önceki çözüm neden yetmiyor?

Tailwind utility'leriyle her bileşene ayrı açık/koyu sınıf yazabilirsin. Aynı “birincil eylem” rengi farklı yerlerde dağıldığında tutarlılık kaybolur. 4. modüldeki `@theme` fikrini burada **anlamsal token** ile genişlet: bileşen `bg-primary text-primary-foreground` der; renk değeri tema dosyasında yaşar.

```css title="src/index.css"
@import "tailwindcss";

@custom-variant dark (&:is(.dark *));

:root {
  --primary: oklch(0.55 0.18 40);
  --primary-foreground: oklch(0.98 0 0);
}

.dark {
  --primary: oklch(0.78 0.14 45);
  --primary-foreground: oklch(0.19 0 0);
}

@theme inline {
  --color-primary: var(--primary);
  --color-primary-foreground: var(--primary-foreground);
}
```

OKLCH'deki ilk sayı **algısal açıklık** (0 siyah, 1 beyaz), ikinci **chroma** (renk yoğunluğu), üçüncü **hue** açısıdır. Açıklık "algısal" olduğu için iki rengin ilk sayıları arasındaki fark, göze ne kadar ayrışacaklarına dair iyi bir ilk ipucudur; kesin kontrast oranını yine bir erişilebilirlik aracıyla ölçersin. `components.json` içindeki `tailwind.cssVariables: true`, üretilen bileşenlerin bu değişken düzenini kullanmasını sağlar.

Adlandırma bir sözleşmedir: her yüzey rolü `--x`, üstündeki metin `--x-foreground` (`--card` / `--card-foreground`, `--primary` / `--primary-foreground`). Tek istisna sayfanın kendisi: `--background` ile `--foreground`.

## `.dark` sınıfı nerede durmalı?
`.dark { --primary: … }` kuralı yalnızca `.dark` sınıflı öğenin **altındaki** öğelere uygulanır. Sinema şu an `dark` sınıfını `RootLayout`'taki bir `<div>`'e koyuyor. Ama dialog ve dropdown içerikleri portal ile `document.body` altına render edilir; o `<div>`'in dışında kalırlar ve koyu temada **açık tema renkleriyle** açılırlar. Çözüm: sınıfı `<html>` öğesine koy (`document.documentElement.classList.toggle('dark', isDark)`).

## Tekrar merdiveni

Önce kart yüzeyi için `bg-card text-card-foreground` kullanacaksın; `cn` ile dışarıdan gelen `className`'i birleştirip bileşeni yerel bağlamda özelleştirilebilir bırakacaksın. Sonra tema dosyasını bir **bekçi fonksiyonla** denetleyeceksin: hangi rol çiftinin açıklık farkı okunamayacak kadar az?

:::mistake[Sık hata]
Yalnız `--primary` değerini değiştirip `--primary-foreground` değerini sabit bırakma. Açık ve koyu temalarda metin arka planın üstünde okunabilir kalmalı.
:::

:::sector[Sektörde]
Tasarım token'ları CSS'de merkezi dururken bileşenler rengin **rolünü** söyler. Marka rengi değiştiğinde kart, buton ve formu tek tek açmak gerekmez.
:::
