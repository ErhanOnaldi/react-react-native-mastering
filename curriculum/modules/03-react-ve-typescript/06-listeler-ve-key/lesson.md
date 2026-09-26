---
title: Listeler ve key
minutes: 9
kind: concept
---

# Listeler ve key

:::pain[Problem]
Film notları listesinde her satıra bir input koydun. “Puana göre sırala” deyince yazdığın not başka filmin yanında göründü. Her satıra `key={index}` vermiştin.
:::

## Liste öğesinin kimliği

React bir diziden ürettiğin kardeş elementleri sonraki render'daki elementlerle eşleştirir. `key`, bu eşleştirme için kararlı kimliktir; sıralama veya filtreleme değişse bile aynı veri öğesine ait kalmalıdır. Dizi indeksi ise öğenin kimliğini değil, o anki konumunu anlatır.

Immutability ile yeni liste üretmeyi öğrendin; şimdi React'in o listenin eski hâliyle yenisini nasıl ilişkilendirdiğini görüyorsun. Sinema notunun başka filme taşınması bu eşleştirmenin bozulmuş hâli. Form satırları, sepet ürünleri ve yeniden sıralanabilen her listede aynı ilke geçerlidir.

## Key kimliği taşır
React, kardeş öğeleri render’lar arasında `key` ile eşler. Sıra değiştiğinde index yeni bir filme ait olabilir; React eski input DOM’unu yeni filme bağlar. Film id’si sıralamada da aynı filme aittir.

```tsx check
const movies = [{ id: 550, title: 'Dövüş Kulübü' }, { id: 155, title: 'Kara Şövalye' }]
export default function MovieList() {
  return <ul>{movies.map(movie => <li key={movie.id}>{movie.title}</li>)}</ul>
}
```

Bu dersteki önizlemede ilk input’a not yaz, ardından sırala. Index key ile notun taşındığı filmi gör; id key’e geçince not aynı filmde kalır. `key` bileşenin props’una otomatik geçmez; film kimliği gerekiyorsa ayrıca `movie.id` prop’u ver.

:::mistake
Rastgele `Math.random()` key üretmek de her render’da yeni kimlik yaratır. Sabit API id’si varken onu kullan.
:::

:::sector
Arama, sıralama ve filtreleme yapan listelerde sabit kimlik, yalnızca performans değil veri doğruluğu meselesidir.
:::
