---
title: Koşullu class ve cn()
minutes: 9
kind: concept
---

# Koşullu class ve cn()

:::pain[Problem]
`'btn ' + (active ? 'on' : '')` ifadesinde boşluk unutulunca `btnon` oluştu. Kartın `p-2` class'ına dışarıdan `p-4` eklendi; HTML'de son yazılması hangi CSS kuralının kazanacağını garanti etmiyor.
:::

## Dinamik sınıfları güvenli birleştir

React bileşenleri duruma göre farklı class string'leri üretebilir. Basit string ekleme, boşluk veya çakışma hatasına açıktır. `clsx` koşullu parçaları birleştirir; `tailwind-merge` birbiriyle çatışan Tailwind utility'lerini yorumlar. `cn()` bu iki ihtiyacı tek yardımcıda toplar, fakat hangi class'ın tasarım sözleşmesi olduğunu yine component API'si belirler.

Sinema kartının kendi `p-2` değeri ile dışarıdan verilen `p-4` çatışınca sorun görünür olur. Tema token'ı ortak değeri, `cn` ise kullanım anındaki sınıf birleşimini yönetir. Bir sonraki derste sınırlı varyantları ayrı bir tabloda tanımlayacaksın.

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

## Çakışmayı gözünle gör

Önce `className="p-2 p-4"` yazıp önizlemeye bak. DevTools'ta kazanan kuralı belirleyen şey HTML class sırası değil, CSS kural sırasıdır. Sonra aynı girdiyi `cn('p-2', 'p-4')` ile üret: DOM'da yalnız `p-4` kalır. Testin kesin olarak söyleyebildiği şey bu son class string'idir.

Koşullu nesne de kullanabilirsin: `cn('rounded', { 'bg-sky-700': active, 'bg-slate-100': !active })`. Böylece boşluk eklemeyi elle yönetmezsin. Yeni bağlam dışarıdan `className` kabul eden Card'dır; onun temel padding'i kullanıcının isteğiyle çatıştığında `cn('p-2', className)` son girdiyi korur.

:::sector
`cn()` keyfi CSS seçicilerinin tüm önceliğini çözmez. Saf fonksiyonu `p-2`/`p-4` ve koşullu değerlerle doğrudan test edebilirsin.
:::
