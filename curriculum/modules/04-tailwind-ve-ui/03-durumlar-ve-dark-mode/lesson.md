---
title: Etkileşim durumları ve dark mode
minutes: 9
kind: concept
---

# Etkileşim durumları ve dark mode

:::pain[Problem]
Fareyle favori yıldızını buluyorsun ama Tab ile gezerken odak görünmüyor. Koyu temada kart okunuyor, düğme hâlâ açık tema rengiyle parlıyor.
:::

## Duruma class ekle

`hover:` fare işaretçisi üstündeyken, `focus-visible:` görünür klavye odağında, `disabled:` gerçek `disabled` niteliği varken uygulanır. Görsel durum ile HTML davranışını birlikte kur.

```tsx check
export function FavoriteButton({ disabled }: { disabled: boolean }) {
  return <button disabled={disabled} className="rounded-lg bg-sky-700 px-3 py-2 text-white hover:bg-sky-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-500 disabled:cursor-not-allowed disabled:opacity-50">Favoriye ekle</button>
}
```

`group` üst öğedeyse çocukta `group-hover:` kullanılabilir. Yalnız hover ile gösterilen önemli bilgi klavye ve dokunmatik kullanıcıdan saklanmamalı.

## Dark tema

Tailwind v4'te `.dark` class'ına bağlı varyantı CSS'te tanımlarsın:

```css title="src/index.css"
@import "tailwindcss";
@custom-variant dark (&:where(.dark, .dark *));
```

`bg-white text-slate-900 dark:bg-slate-900 dark:text-white` yazınca `.dark` üst öğeye eklendiğinde kart değişir. `dark:` kendi başına tema state'i yönetmez. Tema seçimini kalıcılaştırmak sonraki Hook derslerinin konusudur.

:::sector
Fare yanında Tab ve Enter ile dene. Testte piksel rengini değil, `disabled`, erişilebilir ad ve durum class'larını kontrol et.
:::
