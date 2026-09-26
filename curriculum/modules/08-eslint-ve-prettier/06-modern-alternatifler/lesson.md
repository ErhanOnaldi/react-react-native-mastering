---
title: "Modern alternatifler"
minutes: 7
kind: concept
---

# Modern alternatifler

:::pain[Problem]
Sinema için ESLint ve Prettier ayarlarını kurduk. Yeni bir Vite React projesi açan arkadaşın “template bende oxlint getirdi; sizin config yanlış mı?” diye soruyor.
:::

## Araç seçimini amaçla ilişkilendir

Lint ve formatter ekosisteminde hız, kural kapsamı ve yapılandırma maliyeti farklı araçlarla değişebilir. Yeni bir template'in varsayılanı, mevcut projedeki araçları otomatik olarak yanlış yapmaz. Karşılaştırırken gereken React/TypeScript kurallarını, plugin uyumunu ve geçiş maliyetini birlikte ölçmelisin.

Sinema'da ESLint ve Prettier'ın hangi somut hatayı çözdüğünü gördün. Oxlint veya Biome gibi alternatifleri değerlendirirken de aynı davranışları kontrol edersin. Böylece karar teknoloji modasına değil, ekip ve proje ihtiyaçlarına dayanır.

## Yeni varsayılanı oku

Güncel resmi `create-vite` React TypeScript template’i oxlint ile geliyor. Bu, Sinema’da ESLint öğrenmenin boşa gittiği anlamına gelmez. Araçların kontrol ettiği kural kümesi, eklenti ekosistemi ve proje ihtiyaçları farklıdır.

| Araç | Güçlü tarafı | Karar anı |
| --- | --- | --- |
| ESLint + typescript-eslint + React Hooks | Kapsamlı ve özelleştirilebilir kural ekosistemi | Hook/TS kurallarını ayrıntılı yönetirken |
| Prettier | Kararlı ve yaygın biçimlendirme | Ekipte ortak kod biçimi isterken |
| oxlint | Hızlı lint geri bildirimi | Yeni Vite template’iyle başlarken veya hızlı ilk tarama isterken |
| Biome | Lint ve formatı tek araçta toplama | Desteklediği kurallar proje ihtiyaçlarını karşılıyorsa |

Oxlint ile ESLint birlikte çalışabilir: hızlı tarama ve ardından projeye özgü kurallar. Biome da birçok projede iki aracı sadeleştirebilir. “Daha hızlı” tek başına göç kararı değildir; özellikle React Hook, TypeScript ve özel kuralların gerçekten karşılandığını kontrol et.

## Sinema için seçim

Bu modülde ESLint 10 + Prettier ile devam ediyoruz çünkü eksik dependency uyarısını, düz config’i ve biçim kararını ayrı ayrı gözlemek istiyoruz. Başka projede oxlint veya Biome seçersen önce mevcut kuralların karşılığını ve CI sonucunu karşılaştır. Aracın adı değişse de eski filmi gösteren hata ortadan kendiliğinden kalkmaz.

:::sector
Yeni template’in seçimi ve mevcut üretim projesinin seçimi aynı olmak zorunda değil. Göçte küçük bir dosya kümesini iki araçla lint edip farkları incelemek, sırf hız sayısına bakmaktan daha güvenilir bir denemedir.
:::
