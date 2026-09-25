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

## Sektörde
Verinin anlamını konum yerine alan adıyla anlatmak çoğu zaman daha açık olur; tuple'ı kısa, sırası sabit sonuçlarda kullan.
