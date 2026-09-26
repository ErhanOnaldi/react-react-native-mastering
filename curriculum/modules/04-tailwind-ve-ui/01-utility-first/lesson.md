---
title: Utility-first ile ilk düzen
minutes: 8
kind: concept
---

# Utility-first ile ilk düzen

:::pain[Problem]
Sinema'daki favori, arama ve filtre düğmesine aynı on iki CSS kararını kopyaladın. Birindeki boşluğu değiştirince öbür ikisi farklı kaldı.
:::

## Utility-first yaklaşımı

Geleneksel CSS'te bir sınıfa birçok görsel karar yazarsın. Utility-first yaklaşımında ise boşluk, renk ve düzen gibi küçük, tek amaçlı sınıfları HTML/JSX üzerinde birleştirirsin. Tailwind bu sınıfları kaynak kodunda gördüğü adlardan üretir. Bu yöntem stil kararını bileşenin yanında görünür kılar; ortaklaşan tasarımın ne zaman bileşene taşınacağını yine sen seçersin.

Sinema düğmelerindeki tekrar, yöntem değişiminin gerekçesi. Önce ayrı CSS kurallarının neyi tekrarladığını görüp sonra utility'lerle aynı görünümü kuracaksın. Tailwind React'in veri akışını değiştirmez; yalnız görünüm katmanında çalışır.

## Bildiğin yöntem nerede zorlanıyor?

Ayrı `.favorite-button`, `.search-button` ve `.filter-button` kuralları kısa başlar; ortak kararlar çoğaldığında her tanıma geri dönmen gerekir. Tailwind'in **utility-first** yaklaşımında `px-4`, `py-2`, `rounded-lg` gibi tek görevli class'lar öğenin üstünde durur. Önizlemede class'ı değiştir ve farkı hemen gör.

```tsx title="src/components/MovieAction.tsx"
export function MovieAction() {
  return <button className="rounded-lg bg-sky-700 px-4 py-2 font-semibold text-white">Favoriye ekle</button>
}
```

`px-4` yatay, `py-2` dikey iç boşluk; `bg-sky-700` arka plan rengidir. Sayılar piksel değil Tailwind ölçeğidir. Class adını `'px-' + size` diye üretme: Tailwind kaynakta tam class adlarını arar.

## V4 kurulumu

Vite'ta `@tailwindcss/vite` eklentisi ve ana CSS'te `@import "tailwindcss";` kullanılır. V4 özelleştirmesi CSS içindedir. Eski üç `@tailwind` direktifi ve `tailwind.config.js` örnekleri bu kurulumun parçası değildir.

## Tekrarın sınırı

Utility'ler küçük bir kartı hızlı kurar; on iki class yirmi düğmede tekrarlanınca yine kopyalama acısı doğar. Son derslerde bu kararları ortak Button'a taşıyacağız.

## Önizlemede küçük bir deney

Önce kartın `px-4` class'ını kaldır: metin kenara yapışır, dikey boşluk kalır. Sonra `py-2` class'ını kaldır: bu kez tersini görürsün. Böylece `p`, `px` ve `py` kısaltmalarının hangi eksene dokunduğunu ezberlemeden anlarsın. Bir class'ın nerede kullanıldığını JSX üzerinde görmek, ayrı CSS dosyasındaki seçici zincirini takip etme ihtiyacını azaltır.

```ts check
const sizes = { compact: 'px-2 py-1', regular: 'px-4 py-2' } as const
const chosen = sizes.regular
```

Bu seçimde kaynakta iki **tam** class string'i var; Tailwind onları bulabilir. `px-${n}` gibi parça birleştirme ise kaynak taramasında tamamlanmış class olarak görünmez.

:::sector
Takımda tekrar eden tasarım kararını görünce ortak bileşene çıkar; tek kullanımlık görünümü gereksiz soyutlama ile saklama.
:::
