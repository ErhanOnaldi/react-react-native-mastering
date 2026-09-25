---
title: Koşullu class ve cn()
minutes: 9
kind: concept
---

# Koşullu class ve cn()

:::pain[Problem]
`'btn ' + (active ? 'on' : '')` ifadesinde boşluk unutulunca `btnon` oluştu. Kartın `p-2` class'ına dışarıdan `p-4` eklendi; HTML'de son yazılması hangi CSS kuralının kazanacağını garanti etmiyor.
:::

## İki sorun, iki yardımcı

`clsx` koşullu parçaları birleştirir. `tailwind-merge` çatışan Tailwind utility'lerinden son girdiyi tutar. Birlikte `cn()` olur:

```ts check
import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'
function cn(...inputs: ClassValue[]) { return twMerge(clsx(inputs)) }
const active = true
cn('rounded p-2', active && 'bg-sky-700', 'p-4') // "rounded bg-sky-700 p-4"
```

`cn('p-2','p-4')` ikinciyi tutar. `p-2` ile `px-4` birlikte anlamlı olabilir: biri dikey boşluğu da verir, diğeri yatayı değiştirir. Bu, class string çözümlemesidir; computed CSS testi değildir.

## Dışarıdan class

Bir bileşen `className` alıyorsa `cn('rounded-xl p-2', className)` kullan. Bu hem koşullu parçaları hem tüketicinin override'ını işler. Sonraki derste cva'nın varyant çıktısını da aynı şekilde birleştireceğiz.

:::sector
`cn()` keyfi CSS seçicilerinin tüm önceliğini çözmez. Saf fonksiyonu `p-2`/`p-4` ve koşullu değerlerle doğrudan test edebilirsin.
:::
