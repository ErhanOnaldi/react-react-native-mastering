---
title: Dört kat aşağı inen favori prop’u
minutes: 8
kind: concept
---

# Dört kat aşağı inen favori prop’u

:::pain[Problem]
App’ten karttaki favori düğmesine ulaşmak için aynı `favoriteIds` ve `onToggleFavorite` prop’ları dört kat aktarılıyor. Aradaki bileşenler onları kullanmıyor.
:::

## Ağaçta ortak değer taşı

Context, bir değeri her ara component'e prop olarak geçirmeden alt ağaçtaki tüketicilere ulaştırır. Provider hangi bölümün değeri paylaşacağını belirler; tüketici onu hook üzerinden okur. Context bir veri taşıma mekanizmasıdır, otomatik olarak cache, kalıcılık veya ince abonelik sağlamaz.

Sinema favori id'leri dört kat prop üzerinden taşınıyorsa aradaki bileşenler yalnız kurye hâline gelmiştir. Custom hook ile tüketimi adlandırabilir, yerel saklamayı ayrı hook'ta yönetebilirsin. İleride sık değişen ortak state büyüdüğünde Redux kararını bu sınır üzerinden değerlendireceksin.

## Ne değişiyor?

Context ortak değeri ağaçtan geçirir. `createContext<Value | null>(null)` ve provider dışında kullanımı açıklayıcı hata ile engelleyen `useFavorites()` yaz.

## Sinema'da dene

Favori id’lerini `useLocalStorage` ile sakla. Context değeri değişince onu okuyan tüketiciler yeniden render eder; her state için otomatik çözüm değildir.

## Prop zincirini kır

```text
App → Layout → Section → Grid → MovieCard → FavoriteButton
```

Aradaki bileşenler `favoriteIds` ile hiçbir iş yapmıyorsa Context uygun bir sınır olabilir. Provider değeri ağaca verir; tüketici `useFavorites()` ile okur. `createContext<Value | null>(null)` ve hook içindeki null kontrolü, yanlışlıkla provider dışındaki kullanımı açıklayıcı hata yapar.

Favori id dizisi bir kullanıcı tercihidir: `useLocalStorage<number[]>` ile saklanır. `toggleFavorite(id)` mevcut id’yi çıkarır ya da yeni diziye ekler. Aynı id’ye bakan iki kart, ortak değerden aynı sonucu üretir.

Context değeri değiştiğinde onu kullanan tüketiciler yeniden render olabilir. Bu küçük favori state’i için anlaşılır; yüzlerce bağımsız veri alanını tek provider’a doldurmak uygun değildir. Bazen `children` composition da prop zincirini kısaltır.

:::mistake[Sık hata]
`createContext([])` ile varsayılan boş dizi vermek provider eksikliğini gizler. Null + kontrollü hook yanlış yerleşimi hemen gösterir.
:::

:::sector
Bir bileşeni doğrudan children olarak geçirmek de bazen prop aktarımını azaltır. Context’i gerçekten ortak davranış olduğunda seç.
:::
