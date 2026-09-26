---
title: Etkileşim durumları ve dark mode
minutes: 9
kind: concept
---

# Etkileşim durumları ve dark mode

:::pain[Problem]
Fareyle favori yıldızını buluyorsun ama Tab ile gezerken odak görünmüyor. Koyu temada kart okunuyor, düğme hâlâ açık tema rengiyle parlıyor.
:::

## Görünüm duruma tepki verir

Bir öğenin görünümü yalnız sabit rengiyle tanımlanmaz. Hover, klavye odağı, disabled ve tema seçimi farklı durumlarda farklı kurallar gerektirir. Tailwind varyantları CSS pseudo-class veya üst öğe koşulunu sınıf adına taşır. Görsel işaretin gerçek HTML davranışıyla uyumlu olması gerekir; soluk görünüm tek başına disabled anlamına gelmez.

Sinema favori düğmesini fareyle ve klavyeyle denemenin nedeni budur. React state'i `aria-pressed` gibi anlamı belirler, Tailwind o durumu görsel olarak anlatır. Daha sonraki erişilebilirlik modülünde bu ilişkinin ekran okuyucu tarafını ayrıntılandıracaksın.

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

## Kart ve düğme birlikte tepki versin

Kartın üstüne gelindiğinde içindeki puanın vurgulanması için üst öğeye `group`, puana `group-hover:text-sky-700` ekleyebilirsin. Ama puan yalnız bu durumda görünür olmamalı: mobilde hover yok. Aynı nedenle favori düğmesinin seçili hali yalnız renkle anlatılmaz; `aria-pressed` gerçek durumu bildirir.

```tsx check
export function FavoriteToggle({ active }: { active: boolean }) {
  return <button type="button" aria-pressed={active} className="focus-visible:outline-2">{active ? 'Favorilerden çıkar' : 'Favoriye ekle'}</button>
}
```

Önizlemede önce fareyle, ardından Tab ile gezin. Focus class'ı varsa klavye odağı görülebilir; testte de bu class'ı ve `aria-pressed` durumunu ayrı ayrı kontrol edersin.

:::sector
Fare yanında Tab ve Enter ile dene. Testte piksel rengini değil, `disabled`, erişilebilir ad ve durum class'larını kontrol et.
:::
