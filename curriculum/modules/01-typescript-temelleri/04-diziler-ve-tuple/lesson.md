---
title: Diziler ve tuple
minutes: 8
kind: concept
---

# Diziler ve tuple

:::pain[Problem]
Trend listesindeki `results` için tek bir film tipi yazdın. `map` kullanınca koleksiyonun ve dönüş sonucunun tipi de önemli hale geldi.
:::

## Dizi elemanını izle
`Movie[]` her elemanın Movie olduğunu söyler. `filter` yine `Movie[]`, `map` ise callback'in sonucuna göre yeni bir dizi döndürür.

```ts check
type Movie = { id: number; title: string }
const movies: Movie[] = [{ id: 550, title: 'Dövüş Kulübü' }]
const titles = movies.map((movie) => movie.title) // string[]
void titles
```

## Sıra da anlam taşıyorsa
`[number, string]` iki konumlu bir tuple'dır: ilk eleman sayı, ikincisi metin. React `useState` de değer ile setter'ı belirli sırada döndürür; React tiplerini sonraki modülde açacağız.

:::mistake
`number[]`, iki eleman zorunluluğunu anlatmaz. Film id'si ile başlığı belirli sırada döndürmek istiyorsan tuple kullan.
:::

## map sonucu neden değişti?
`movies.map(movie => movie.title)` içindeki callback her filmden string çıkarır. Girdi `Movie[]`, çıktı `string[]` olur. Poster alanı bulunan bir listede `filter(movie => movie.poster_path !== null)` yalnızca öğeleri seçer; çıktı yine `Movie[]` kalır. Bu iki metodu birleştirince önce postersizleri ayırır, sonra kart başlıklarını üretebilirsin.

Dizilerde sıralama korunur. Trend listesini `map` ile etiketlere çevirdiğinde ilk film ilk etiket olarak kalır. `map` ve `filter` mevcut diziyi değiştirmez; bu alışkanlık React state güncellemelerinde de işine yarayacak.

## Tuple'ın sınırı
`[first: number, last: number]` iki sayının anlamlı sırasını belirtir. Sayfalama aralığında ilk ve son sayfayı taşımak için işe yarar. Fakat yirmi filmi tuple ile tarif etmek doğru değil; uzunluğu değişen liste için `Movie[]` kullan. Bir tuple'ın etiketli konum adları okurken yardımcıdır ama çalışma zamanında alan adı yaratmaz: değeri hâlâ `[1, 3]` dizisidir.

:::tip[Sonraki bağlam]
React `useState` değer ve setter'ı iki konumlu sonuç olarak verir. Şimdi tuple fikrini öğreniyoruz; bileşende state tipini sonraki modülde kullanacağız.
:::

## Sektörde
Verinin anlamını konum yerine alan adıyla anlatmak çoğu zaman daha açık olur; tuple'ı kısa, sırası sabit sonuçlarda kullan.
